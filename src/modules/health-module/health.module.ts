import { Module } from '@nestjs/common'

import { HealthHttpController } from '@/modules/health-module/presentation/health.http-controller'

@Module({
  controllers: [HealthHttpController],
})
export class HealthModule {}
