import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { prismaConfig } from '@/common/infrastructure/persistence/prisma/prisma.config'
import { PrismaService } from '@/common/infrastructure/persistence/prisma/prisma.service'

@Module({
  imports: [ConfigModule.forFeature(prismaConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
