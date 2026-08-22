import { Injectable } from '@nestjs/common'

import { ExampleEntity } from '../../domain/example.entity'
import { ExampleRepository } from '../../infrastructure/example.repository'
import { ExampleNotFoundException } from '../exceptions/example-not-found.exception'

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
