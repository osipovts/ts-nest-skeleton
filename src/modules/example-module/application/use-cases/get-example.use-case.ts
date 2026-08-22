import { Injectable } from '@nestjs/common'

import { ExampleNotFoundException } from '@/modules/example-module/application/exceptions/example-not-found.exception'
import { ExampleEntity } from '@/modules/example-module/domain/example.entity'
import { ExampleRepository } from '@/modules/example-module/infrastructure/example.repository'

@Injectable()
export class GetExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(id: string): Promise<ExampleEntity> {
    const entity = await this.exampleRepository.get(id)

    if (!entity) {
      throw new ExampleNotFoundException(id)
    }

    return entity
  }
}
