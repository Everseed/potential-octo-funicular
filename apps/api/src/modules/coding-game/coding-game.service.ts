// src/coding-game/coding-game.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import * as Docker from 'dockerode';
import { PrismaService } from '@/prisma/prisma.service';
import { SessionType } from '@prisma/client';

@Injectable()
export class CodingGameService {
  private docker: Docker;
  private readonly supportedLanguages = {
    javascript: {
      name: 'JavaScript',
      version: 'Node 16',
      image: 'node:16-alpine',
      executeCmd: (code: string) => ['node', '-e', code],
      templates: {
        default: 'function solution() {\n  // Your code here\n}',
        class: 'class Solution {\n  // Your code here\n}',
      },
    },
    python: {
      name: 'Python',
      version: '3.9',
      image: 'python:3.9-alpine',
      executeCmd: (code: string) => ['python', '-c', code],
      templates: {
        default: 'def solution():\n    # Your code here\n    pass',
        class: 'class Solution:\n    # Your code here\n    pass',
      },
    },
    java: {
      name: 'Java',
      version: '17',
      image: 'openjdk:17-alpine',
      executeCmd: (code: string) => {
        const className = 'Solution';
        const fullCode = `public class ${className} {\n${code}\n}`;
        return ['java', '-cp', '/app', className];
      },
      templates: {
        default:
          'public static void main(String[] args) {\n    // Your code here\n}',
        class: 'public class Solution {\n    // Your code here\n}',
      },
    },
  };

  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
  ) {
    this.docker = new Docker();
  }

  private getContainerConfig(language: string, code: string, input?: string) {
    const langConfig = this.supportedLanguages[language];
    if (!langConfig) {
      throw new BadRequestException(`Language ${language} not supported`);
    }

    // Préparer le code avec l'input si nécessaire
    let finalCode = code;
    if (input) {
      finalCode = this.prepareCodeWithInput(language, code, input);
    }

    return {
      Image: langConfig.image,
      Cmd: langConfig.executeCmd(finalCode),
      NetworkDisabled: true,
      HostConfig: {
        Memory: 50 * 1024 * 1024, // 50MB
        MemorySwap: -1,
        CpuPeriod: 100000,
        CpuQuota: 50000,
      },
      WorkingDir: '/app',
      Tty: false,
    };
  }

  private prepareCodeWithInput(
    language: string,
    code: string,
    input: string,
  ): string {
    switch (language) {
      case 'javascript':
        return `
          const input = ${JSON.stringify(input)};
          ${code}
          console.log(solution(input));
        `;
      case 'python':
        return `
input = """${input}"""
${code}
print(solution(input))
        `;
      case 'java':
        return `
public class Solution {
    public static void main(String[] args) {
        String input = "${input.replace(/"/g, '\\"')}";
        ${code}
        System.out.println(solution(input));
    }
    ${code.includes('solution(') ? '' : 'public static String solution(String input) {\n    return "";\n}'}
}
        `;
      default:
        return code;
    }
  }

  async startCodingSession(data: {
    challengeId?: string;
    userId: string;
    type: 'PRACTICE' | 'INTERVIEW' | 'ASSESSMENT';
    language: string;
    timeLimit?: number;
  }) {
    const { challengeId, userId, type, language, timeLimit } = data;
    // const enumValue = SessionType[type as keyof typeof SessionType];
    // Créer une nouvelle session
    const session = await this.prisma.codeSession.create({
      data: {
        sessionId: Math.random().toString(36).substr(2, 9),
        language,
        code: this.supportedLanguages[language].templates.default,
        session: {
          // @ts-expect-error(conversion d'un type)
          type,
          startTime: new Date(),
          timeLimit: timeLimit || 3600, // 1 heure par défaut
          challengeId,
          status: 'IN_PROGRESS',
        },
      },
    });

    // Si c'est un challenge spécifique, charger les données du challenge
    if (challengeId) {
      const challenge = await this.getChallenge(challengeId);
      // @ts-expect-error(possiblité d'un objet null)
      session.sessionData = {
        // @ts-expect-error(possiblité d'un objet null)
        ...session.sessionData,
        challenge: challenge.sessionData,
      };
    }

    return session;
  }

  async saveCodingProgress(
    sessionId: string,
    code: string,
    language: string,
    userId: string,
  ) {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId, language },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.prisma.codeSession.update({
      where: { sessionId },
      data: {
        code,
        updatedAt: new Date(),
        session: {
          // @ts-expect-error(possiblité d'un objet null)
          ...session?.session,
          lastSaved: new Date(),
        },
      },
    });
  }

  async runTests(
    sessionId: string,
    code: string,
    language: string,
    userId: string,
    testCase?: string,
  ) {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const testCases = testCase
      ? [testCase]
      : // @ts-expect-error(possiblité d'un proprieté inexistante)
        session.sessionData.challenge?.testCases || [];

    const results = await Promise.all(
      testCases.map(async (test) => {
        const result = await this.executeCode(
          sessionId,
          code,
          language,
          test.input,
        );
        return {
          input: test.input,
          expected: test.expectedOutput,
          actual: result.output.trim(),
          passed: result.output.trim() === test.expectedOutput.trim(),
        };
      }),
    );

    await this.prisma.codeSession.update({
      where: { sessionId },
      data: {
        session: {
          // @ts-expect-error(possiblité d'un objet null)
          ...session.sessionData,
          lastTestRun: {
            timestamp: new Date(),
            results,
          },
        },
      },
    });

    return results;
  }

  async executeCode(
    sessionId: string,
    code: string,
    language: string,
    input?: string,
  ) {
    // Vérifier que le langage est supporté
    if (!this.supportedLanguages[language]) {
      throw new BadRequestException(`Language ${language} not supported`);
    }

    try {
      // Créer et configurer le conteneur
      const containerConfig = this.getContainerConfig(language, code, input);
      const container = await this.docker.createContainer(containerConfig);

      // Démarrer le conteneur avec un timeout
      await container.start();

      // Récupérer le résultat avec un timeout
      const output = (await Promise.race([
        this.getContainerLogs(container),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Execution timeout')), 10000),
        ),
      ])) as string;

      // Mettre à jour la session
      await this.prisma.codeSession.update({
        where: { sessionId },
        data: {
          code,
          output,
          updatedAt: new Date(),
        },
      });

      // Nettoyer le conteneur
      await container.stop();
      await container.remove();

      // Notifier les clients via WebSocket
      this.websocketGateway.server
        .to(`session:${sessionId}`)
        .emit('code:executed', {
          output,
          timestamp: new Date(),
        });

      return { success: true, output };
    } catch (error) {
      // Gérer les différentes erreurs possibles
      let errorMessage = 'Execution error';
      if (error.message === 'Execution timeout') {
        errorMessage = 'Code execution timed out';
      } else if (error.stderr) {
        errorMessage = error.stderr.toString();
      }

      return { success: false, error: errorMessage };
    }
  }

  private async getContainerLogs(container: Docker.Container): Promise<string> {
    return new Promise((resolve, reject) => {
      container.logs(
        {
          stdout: true,
          stderr: true,
          follow: true,
          timestamps: false,
          tail: 'all',
        },
        (err, stream) => {
          if (err) {
            return reject(err);
          }

          let output = '';
          stream.on('data', (chunk) => {
            output += chunk.toString('utf8');
          });

          stream.on('end', () => {
            resolve(output);
          });

          stream.on('error', (err) => {
            reject(err);
          });
        },
      );
    });
  }

  async getHints(sessionId: string, userId: string) {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // @ts-expect-error(possiblité d'un objet null)
    const hints = session.sessionData.challenge?.hints || [];
    // @ts-expect-error(possiblité d'un objet null)
    const unlockedHints = session.sessionData.unlockedHints || [];

    // Retourner uniquement les indices déjà débloqués
    return hints.filter((_, index) => unlockedHints.includes(index));
  }

  async getSessionAnalytics(sessionId: string, userId: string) {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // @ts-expect-error(possiblité d'un objet null)
    const testRuns = session.sessionData.testRuns || [];
    // @ts-expect-error(possiblité d'un objet null)
    const submissions = session.sessionData.submissions || [];

    return {
      sessionDuration:
        // @ts-expect-error(possiblité d'un objet null)
        new Date().getTime() -
        new Date(session.sessionData.startTime).getTime(),
      totalTestRuns: testRuns.length,
      successfulTests: testRuns.filter((run) =>
        run.results.every((r) => r.passed),
      ).length,
      submissions: submissions.length,
      lastSubmission: submissions[submissions.length - 1],
      averageTestRunSuccess:
        testRuns.length > 0
          ? (testRuns.reduce(
              (acc, run) =>
                acc +
                run.results.filter((r) => r.passed).length / run.results.length,
              0,
            ) /
              testRuns.length) *
            100
          : 0,
    };
  }

  async getChallenge(challengeId: string) {
    // Rechercher le challenge dans la base de données
    const challenge = await this.prisma.codeSession.findFirst({
      where: {
        id: challengeId,
        // @ts-expect-error(possiblité d'un objet null)
        sessionData: {
          path: ['type'],
          equals: 'CHALLENGE',
        },
      },
      include: {
        session: true, // Inclure les informations de la session associée
      },
    });

    // Si le challenge n'existe pas, lancer une erreur
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }

    // Préparer les données du challenge en excluant les informations sensibles
    // comme les solutions des tests cachés
    // @ts-expect-error(possiblité d'un objet null)
    const sanitizedTestCases = challenge.sessionData.testCases.map(
      (testCase) => ({
        ...testCase,
        solution: testCase.isHidden ? undefined : testCase.solution,
      }),
    );

    return {
      ...challenge,
      sessionData: {
        // @ts-expect-error(possiblité d'un objet null)
        ...challenge.sessionData,
        testCases: sanitizedTestCases,
      },
    };
  }

  // Ajouter dans CodingGameService

  async createChallenge(data: {
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    timeLimit: number;
    template: Record<string, string>;
    testCases: Array<{
      input: string;
      expectedOutput: string;
      isHidden?: boolean;
    }>;
    category: string[];
    creatorId: string;
  }) {
    return this.prisma.codeSession.create({
      data: {
        // @ts-expect-error(possiblité d'un objet null)
        sessionData: {
          type: 'CHALLENGE',
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'ACTIVE',
        },
        code: data.template[Object.keys(data.template)[0]] || '',
        language: Object.keys(data.template)[0],
      },
    });
  }

  async getChallenges(params: {
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    category?: string;
  }) {
    const { difficulty, category } = params;

    const where: any = {
      sessionData: {
        path: ['type'],
        equals: 'CHALLENGE',
      },
    };

    if (difficulty) {
      where.AND = {
        sessionData: {
          path: ['difficulty'],
          equals: difficulty,
        },
      };
    }

    if (category) {
      where.AND = {
        sessionData: {
          path: ['category'],
          array_contains: category,
        },
      };
    }

    return this.prisma.codeSession.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async submitSolution(
    challengeId: string,
    code: string,
    language: string,
    userId: string,
  ) {
    const challenge = await this.getChallenge(challengeId);
    const testResults = [];

    for (const testCase of challenge.sessionData.testCases) {
      const result = await this.executeCode(
        challengeId,
        code,
        language,
        testCase.input,
      );

      testResults.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: result.output?.trim(),
        passed: result.output?.trim() === testCase.expectedOutput.trim(),
        isHidden: testCase.isHidden,
      });
    }

    // Créer ou mettre à jour la soumission
    const submission = {
      userId,
      code,
      language,
      timestamp: new Date(),
      results: testResults,
      passed: testResults.every((r) => r.passed),
    };

    await this.prisma.codeSession.update({
      where: { id: challengeId },
      data: {
        // @ts-expect-error(possiblité d'un objet null)
        sessionData: {
          ...challenge.sessionData,
          submissions: [
            ...(challenge.sessionData.submissions || []),
            submission,
          ],
        },
      },
    });

    return {
      success: testResults.every((r) => r.passed),
      results: testResults.filter((r) => !r.isHidden),
      submission,
    };
  }

  getCodeTemplates(language: string, type = 'default'): string {
    const langConfig = this.supportedLanguages[language];
    if (!langConfig) {
      throw new BadRequestException(`Language ${language} not supported`);
    }
    return langConfig.templates[type] || langConfig.templates.default;
  }

  getSupportedLanguages() {
    return Object.entries(this.supportedLanguages).map(([id, config]) => ({
      id,
      name: config.name,
      version: config.version,
      templates: Object.keys(config.templates),
    }));
  }

  // Dans coding-game.service.ts

  async validateSessionAccess(
    sessionId: string,
    userId: string,
  ): Promise<boolean> {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId },
      include: {
        session: true,
      },
    });

    if (!session) {
      return false;
    }

    // Vérifier si l'utilisateur est lié à cette session
    return (
      session.session?.studentId === userId ||
      session.session?.expertId === userId
    );
  }

  async getSessionOutput(sessionId: string) {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return {
      output: session.output,
      timestamp: session.updatedAt,
    };
  }

  async getSessionState(sessionId: string) {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId },
      include: {
        session: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return {
      code: session.code,
      language: session.language,
      output: session.output,
      // @ts-expect-error(possiblité d'un objet null)
      status: session.sessionData.status,
      // @ts-expect-error(possiblité d'un objet null)
      lastSaved: session.sessionData.lastSaved,
      // @ts-expect-error(possiblité d'un objet null)
      lastTestRun: session.sessionData.lastTestRun,
      // @ts-expect-error(possiblité d'un objet null)
      challenge: session.sessionData.challenge,
    };
  }

  async submitFinalCode(
    sessionId: string,
    code: string,
    language: string,
    userId: string,
  ) {
    const session = await this.prisma.codeSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const result = await this.runTests(sessionId, code, language, userId);
    const allTestsPassed = result.every((r) => r.passed);

    await this.prisma.codeSession.update({
      where: { sessionId },
      data: {
        code,
        // @ts-expect-error(possiblité d'un objet null)
        sessionData: {
          // @ts-expect-error(possiblité d'un objet null)
          ...session.sessionData,
          status: 'COMPLETED',
          finalSubmission: {
            code,
            language,
            timestamp: new Date(),
            results: result,
            passed: allTestsPassed,
          },
        },
      },
    });

    return {
      success: allTestsPassed,
      results: result,
    };
  }

  async createCodeSession(data: {
    userId: string;
    language: string;
    sessionId: string;
    initialCode?: string;
  }) {
    const { userId, language, sessionId, initialCode } = data;

    return this.prisma.codeSession.create({
      data: {
        sessionId,
        language,
        code:
          initialCode || this.supportedLanguages[language].templates.default,
        // @ts-expect-error(insertion d'un objet json)
        sessionData: {
          status: 'IN_PROGRESS',
          startTime: new Date(),
        },
        session: {
          connect: {
            id: sessionId,
          },
        },
      },
    });
  }
}
