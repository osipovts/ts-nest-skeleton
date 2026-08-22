import { Module } from '@nestjs/common'

import { PrismaModule } from '@/common/infrastructure/persistence/prisma/prisma.module'
import { CreateExampleUseCase } from '@/modules/example-module/application/use-cases/create-example.use-case'
import { DeleteExampleUseCase } from '@/modules/example-module/application/use-cases/delete.example.use-case'
import { GetExampleUseCase } from '@/modules/example-module/application/use-cases/get-example.use-case'
import { ListExamplesUseCase } from '@/modules/example-module/application/use-cases/list-examples.use-case'
import { ExampleRepository } from '@/modules/example-module/infrastructure/example.repository'
import { ExampleHttpController } from '@/modules/example-module/presentation/example.http-controller'

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
