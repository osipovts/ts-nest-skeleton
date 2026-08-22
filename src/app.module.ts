import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appConfig } from '@/app.config'
import { ExampleModule } from '@/modules/example-module/example.module'
import { HealthModule } from '@/modules/health-module/health.module'

@Module({
  imports: [ConfigModule.forRoot({ load: [appConfig] }), HealthModule, ExampleModule],
})
export class AppModule {}
