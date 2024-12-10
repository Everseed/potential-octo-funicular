import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Soft Delete Middleware
    this.$use(async (params: any, next: any) => {
      if (params.model && params.action === 'delete') {
        params.action = 'update';
        params.args['data'] = { deleted: true };
      }
      if (params.model && params.action === 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data !== undefined) {
          params.args.data['deleted'] = true;
        } else {
          params.args['data'] = { deleted: true };
        }
      }
      return next(params);
    });

    // Exclude Deleted Records Middleware
    this.$use(async (params: any, next: any) => {
      if (params.model && params.action === 'findUnique') {
        params.action = 'findFirst';
        params.args.where['deleted'] = false;
      }
      if (params.model && params.action === 'findMany') {
        if (params.args.where) {
          if (params.args.where.deleted === undefined) {
            params.args.where['deleted'] = false;
          }
        } else {
          params.args['where'] = { deleted: false };
        }
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'test') {
      // @ts-nocheck
      const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

      return Promise.all(
        // @ts-nocheck
        models.map((modelKey) => this[modelKey].deleteMany()),
      );
    }
  }
}
