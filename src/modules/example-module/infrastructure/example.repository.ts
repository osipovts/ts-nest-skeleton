import { Inject, Injectable } from '@nestjs/common'
import { Example as ExampleRow, PrismaClient } from '@prisma-generated/client'

import { RepositoryPort } from '@/common/application/ports/repository.port'
import {
  PrismaCrudRepository,
  PrismaTransaction,
} from '@/common/infrastructure/persistence/prisma/prisma.repository'
import { PrismaService } from '@/common/infrastructure/persistence/prisma/prisma.service'

import { ExampleEntity } from '../domain/example.entity'

@Injectable()
export class ExampleRepository
  extends PrismaCrudRepository<ExampleEntity, ExampleRow>
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
}
