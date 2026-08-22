import { Injectable } from '@nestjs/common'

import type { PaginatedResult, PaginationOptions } from '@/common/application/pagination'

import { ExampleEntity } from '../../domain/example.entity'
import { ExampleRepository } from '../../infrastructure/example.repository'

export enum ExampleSortField {
  ID = 'id',
  TEXT = 'text',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface ExampleListOptions extends PaginationOptions<ExampleSortField> {
  text?: string
}

@Injectable()
export class ListExamplesUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  execute(options: ExampleListOptions): Promise<PaginatedResult<ExampleEntity>> {
    return this.exampleRepository.listExamples(options)
  }
}
