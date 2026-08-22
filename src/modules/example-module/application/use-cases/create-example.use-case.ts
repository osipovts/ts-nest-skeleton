import { Injectable } from '@nestjs/common'

import { ExampleEntity } from '../../domain/example.entity'
import { ExampleRepository } from '../../infrastructure/example.repository'

@Injectable()
export class CreateExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(text: string): Promise<ExampleEntity> {
    const entity = new ExampleEntity({ text })
    return this.exampleRepository.save(entity)
  }
}
