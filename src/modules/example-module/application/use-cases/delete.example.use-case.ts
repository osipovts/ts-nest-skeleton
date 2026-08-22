import { Injectable } from '@nestjs/common'

import { ExampleEntity } from '../../domain/example.entity'
import { ExampleRepository } from '../../infrastructure/example.repository'
import { ExampleNotFoundException } from '../exceptions/example-not-found.exception'

@Injectable()
export class DeleteExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(id: string): Promise<ExampleEntity> {
    const entity = await this.exampleRepository.delete(id)

    if (!entity) {
      throw new ExampleNotFoundException(id)
    }

    return entity
  }
}
