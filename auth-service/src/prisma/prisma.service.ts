import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy
{
  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }

  async OnModuleDestroy() {
    await this.$disconnect();
  }
}