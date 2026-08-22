import { Injectable } from '@nestjs/common'

import { ExampleEntity } from '@/modules/example-module/domain/example.entity'
import { ExampleRepository } from '@/modules/example-module/infrastructure/example.repository'

@Injectable()
export class CreateExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(text: string): Promise<ExampleEntity> {
    const entity = new ExampleEntity({ text })
    return this.exampleRepository.save(entity)
  }
}
