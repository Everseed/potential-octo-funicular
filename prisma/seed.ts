// prisma/seed.ts
import { PrismaClient, UserRole, SessionType, SessionStatus, RequestStatus } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.whiteboard.deleteMany();
  await prisma.codeSession.deleteMany();
  await prisma.session.deleteMany();
  await prisma.request.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();

  // Créer des experts
  const experts = await Promise.all([
    prisma.user.create({
      data: {
        email: 'react.expert@example.com',
        name: 'Alex React',
        role: UserRole.EXPERT,
        bio: 'Expert React avec 5 ans d\'expérience',
        expertise: ['react', 'javascript', 'typescript'],
        hourlyRate: 80,
        experience: 5,
        timezone: 'Europe/Paris',
        availability: {
          create: [
            {
              dayOfWeek: 1, // Lundi
              startTime: '09:00',
              endTime: '17:00',
              isRecurring: true
            },
            {
              dayOfWeek: 2, // Mardi
              startTime: '09:00',
              endTime: '17:00',
              isRecurring: true
            }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'node.expert@example.com',
        name: 'Sarah Node',
        role: UserRole.EXPERT,
        bio: 'Experte Node.js et architectures backend',
        expertise: ['nodejs', 'express', 'nestjs'],
        hourlyRate: 90,
        experience: 7,
        timezone: 'Europe/Paris',
        availability: {
          create: [
            {
              dayOfWeek: 3, // Mercredi
              startTime: '10:00',
              endTime: '18:00',
              isRecurring: true
            },
            {
              dayOfWeek: 4, // Jeudi
              startTime: '10:00',
              endTime: '18:00',
              isRecurring: true
            }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'design.expert@example.com',
        name: 'Marie Design',
        role: UserRole.EXPERT,
        bio: 'UI/UX Designer et experte Figma',
        expertise: ['ui', 'ux', 'figma', 'design-systems'],
        hourlyRate: 75,
        experience: 4,
        timezone: 'Europe/Paris'
      }
    })
  ]);

  // Créer des étudiants
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'student1@example.com',
        name: 'Paul Étudiant',
        role: UserRole.STUDENT
      }
    }),
    prisma.user.create({
      data: {
        email: 'student2@example.com',
        name: 'Julie Étudiante',
        role: UserRole.STUDENT
      }
    }),
    prisma.user.create({
      data: {
        email: 'student3@example.com',
        name: 'Marc Étudiant',
        role: UserRole.STUDENT
      }
    })
  ]);

  // Créer des créneaux horaires
  const now = new Date();
  const tomorrow = new Date(now.setDate(now.getDate() + 1));
  const nextWeek = new Date(now.setDate(now.getDate() + 7));

  await Promise.all(experts.map(expert => 
    prisma.timeSlot.createMany({
      data: [
        {
          userId: expert.id,
          startTime: tomorrow,
          endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // +2 heures
          status: 'AVAILABLE'
        },
        {
          userId: expert.id,
          startTime: nextWeek,
          endTime: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000),
          status: 'AVAILABLE'
        }
      ]
    })
  ));

  // Créer des demandes
  const requests = await Promise.all([
    prisma.request.create({
      data: {
        title: 'Aide React Hooks',
        description: 'J\'ai besoin d\'aide avec les hooks personnalisés',
        objectives: ['Comprendre useEffect', 'Créer des hooks custom'],
        userId: students[0].id,
        expertId: experts[0].id,
        category: 'React',
        status: RequestStatus.PENDING,
        duration: 60
      }
    }),
    prisma.request.create({
      data: {
        title: 'Review Architecture Node.js',
        description: 'Review de mon architecture Node.js/Express',
        objectives: ['Optimiser les performances', 'Meilleure structure'],
        userId: students[1].id,
        expertId: experts[1].id,
        category: 'Node.js',
        status: RequestStatus.ACCEPTED,
        duration: 90
      }
    })
  ]);

  // Créer des sessions
  const sessions = await Promise.all([
    prisma.session.create({
      data: {
        type: SessionType.CODE,
        title: 'Session React Hooks',
        description: 'Formation sur les hooks React',
        expertId: experts[0].id,
        studentId: students[0].id,
        duration: 60,
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000),
        status: SessionStatus.SCHEDULED,
        quiz: {
          create: {
            timing: 'END',
            questions: [
              {
                text: "Quel hook pour les effets de bord ?",
                options: ["useEffect", "useState", "useContext", "useReducer"],
                correctAnswer: 0
              }
            ]
          }
        },
        codeSession: {
          create: {
            language: 'javascript',
            code: 'const [state, setState] = useState(0);',
          }
        }
      }
    }),
    prisma.session.create({
      data: {
        type: SessionType.DESIGN,
        title: 'Review Design System',
        description: 'Review du design system',
        expertId: experts[2].id,
        studentId: students[1].id,
        duration: 90,
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 90 * 60 * 1000),
        status: SessionStatus.SCHEDULED,
        whiteboard: {
          create: {
            elements: [
              {
                type: 'rectangle',
                x: 100,
                y: 100,
                width: 200,
                height: 100
              }
            ]
          }
        }
      }
    })
  ]);

  console.log({
    experts: experts.length,
    students: students.length,
    sessions: sessions.length,
    requests: requests.length
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });