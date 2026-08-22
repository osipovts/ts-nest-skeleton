import { Module } from '@nestjs/common'

import { PrismaModule } from '@/common/infrastructure/persistence/prisma/prisma.module'

import { CreateExampleUseCase } from './application/use-cases/create-example.use-case'
import { DeleteExampleUseCase } from './application/use-cases/delete.example.use-case'
import { GetExampleUseCase } from './application/use-cases/get-example.use-case'
import { ListExamplesUseCase } from './application/use-cases/list-examples.use-case'
import { ExampleRepository } from './infrastructure/example.repository'
import { ExampleHttpController } from './presentation/example.http-controller'

@Module({
  imports: [PrismaModule],
  controllers: [ExampleHttpController],
  providers: [
    ExampleRepository,
    GetExampleUseCase,
    ListExamplesUseCase,
    CreateExampleUseCase,
    DeleteExampleUseCase,
  ],
})
export class ExampleModule {}
