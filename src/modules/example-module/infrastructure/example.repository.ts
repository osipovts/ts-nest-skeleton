import { Inject, Injectable } from '@nestjs/common'
import { Example as ExampleRow, Prisma, PrismaClient } from '@prisma-generated/client'

import type { PaginatedResult } from '@/common/application/pagination'
import { RepositoryPort } from '@/common/application/ports/repository.port'
import {
  PrismaCrudRepository,
  PrismaTransaction,
} from '@/common/infrastructure/persistence/prisma/prisma.repository'
import { PrismaService } from '@/common/infrastructure/persistence/prisma/prisma.service'
import { ExampleListOptions } from '@/modules/example-module/application/use-cases/list-examples.use-case'
import { ExampleEntity } from '@/modules/example-module/domain/example.entity'

@Injectable()
export class ExampleRepository
  extends PrismaCrudRepository<
    ExampleEntity,
    ExampleRow,
    Prisma.ExampleWhereInput,
    Prisma.ExampleOrderByWithRelationInput
  >
  implements RepositoryPort<ExampleEntity>
{
  constructor(@Inject(PrismaService) prisma: PrismaClient) {
    super(prisma)
  }

  protected delegate(tx?: PrismaTransaction) {
    return this.client(tx).example
  }

  protected toDomain(row: ExampleRow): ExampleEntity {
    return new ExampleEntity({ text: row.text }, row.id, row.createdAt, row.updatedAt)
  }

  listExamples(options: ExampleListOptions): Promise<PaginatedResult<ExampleEntity>> {
    const { text, sortBy, sortDirection, ...pagination } = options

    return this.list({
      ...pagination,
      sortBy,
      sortDirection,
      where:
        text !== undefined && text !== ''
          ? { text: { startsWith: text, mode: 'insensitive' } }
          : undefined,
      orderBy: { [sortBy]: sortDirection },
    })
  }
}
