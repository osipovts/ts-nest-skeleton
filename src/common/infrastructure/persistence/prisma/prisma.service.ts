import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma-generated/client'

import type { PrismaConfigType } from '@/common/infrastructure/persistence/prisma/prisma.config'
import { prismaConfig } from '@/common/infrastructure/persistence/prisma/prisma.config'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(prismaConfig.KEY) config: PrismaConfigType) {
    super({ adapter: new PrismaPg({ connectionString: config.databaseUrl }) })
  }

  async onModuleInit(): Promise<void> {
    await this.$connect()
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
  }
}
