import { Module } from '@nestjs/common'

import { HealthHttpController } from './presentation/health.http-controller'

@Module({
  controllers: [HealthHttpController],
})
export class HealthModule {}
