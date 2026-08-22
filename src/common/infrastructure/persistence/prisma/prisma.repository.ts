import type { PrismaClient } from '@prisma-generated/client'
import { Prisma } from '@prisma-generated/client'

import type { EntityInterface } from '@/common/domain/abstract.entity'

export type PrismaTransaction = Prisma.TransactionClient
export type PrismaClientContext = PrismaClient | PrismaTransaction

export class UniqueConstraintError extends Error {}

export abstract class PrismaRepository {
  protected constructor(protected readonly prisma: PrismaClient) {}

  transaction<T>(operation: (transaction: PrismaTransaction) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(operation)
  }

  protected client(transaction?: PrismaTransaction): PrismaClientContext {
    return transaction ?? this.prisma
  }
}

export abstract class PrismaCrudRepository<
  TEntity extends EntityInterface,
  TRow,
> extends PrismaRepository {
  // Child has to provide prisma delegate
  protected abstract delegate(tx?: PrismaTransaction): {
    findUnique(args: unknown): Promise<TRow | null>
    count(args: unknown): Promise<number>
    upsert(args: unknown): Promise<TRow>
    delete(args: unknown): Promise<TRow>
  }

  // Child has to provide domain mapper
  protected abstract toDomain(row: TRow): TEntity

  async get(id: string, tx?: PrismaTransaction): Promise<TEntity | null> {
    const row = await this.delegate(tx).findUnique({ where: { id } })
    return row ? this.toDomain(row) : null
  }

  async exists(id: string, tx?: PrismaTransaction): Promise<boolean> {
    const count = await this.delegate(tx).count({ where: { id } })
    return count > 0
  }

  async save(entity: TEntity, tx?: PrismaTransaction): Promise<TEntity> {
    try {
      const row = await this.delegate(tx).upsert({
        where: { id: entity.id },
        update: { ...entity.props },
        create: { ...entity.toFlatObject() },
      })
      return this.toDomain(row)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new UniqueConstraintError()
      }
      throw error
    }
  }

  async delete(id: string, tx?: PrismaTransaction): Promise<TEntity | null> {
    try {
      const row = await this.delegate(tx).delete({ where: { id } })
      return this.toDomain(row)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null
      }
      throw error
    }
  }
}
