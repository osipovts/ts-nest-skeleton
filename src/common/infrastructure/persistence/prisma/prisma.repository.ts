import type { PrismaClient } from '@prisma-generated/client'
import { Prisma } from '@prisma-generated/client'

import type { PaginatedResult, PaginationOptions } from '@/common/application/pagination'
import type { EntityInterface } from '@/common/domain/abstract.entity'
import { DatabaseUnavailableException } from '@/common/infrastructure/persistence/prisma/exceptions/database-unavailable.exception'

export type PrismaTransaction = Prisma.TransactionClient
export type PrismaClientContext = PrismaClient | PrismaTransaction

export class UniqueConstraintError extends Error {}

const DATABASE_UNAVAILABLE_ERROR_CODES = new Set([
  'P1001',
  'P1002',
  'P1017',
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'EPERM',
])

export interface PrismaListOptions<
  TWhere,
  TOrderBy,
  TSortField extends string = string,
> extends PaginationOptions<TSortField> {
  where?: TWhere
  orderBy: TOrderBy
}

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
  TWhere = unknown,
  TOrderBy = unknown,
> extends PrismaRepository {
  // Child has to provide prisma delegate
  protected abstract delegate(tx?: PrismaTransaction): {
    findUnique(args: unknown): Promise<TRow | null>
    count(args: unknown): Promise<number>
    findMany(args: unknown): Promise<TRow[]>
    upsert(args: unknown): Promise<TRow>
    delete(args: unknown): Promise<TRow>
  }

  // Child has to provide domain mapper
  protected abstract toDomain(row: TRow): TEntity

  async list(
    options: PrismaListOptions<TWhere, TOrderBy>,
    tx?: PrismaTransaction,
  ): Promise<PaginatedResult<TEntity>> {
    const { page, pageSize, where, orderBy } = options
    const [rows, totalItems] = await this.withDatabaseErrorMapping(() =>
      Promise.all([
        this.delegate(tx).findMany({
          where,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        this.delegate(tx).count({ where }),
      ]),
    )

    return {
      items: rows.map((row) => this.toDomain(row)),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    }
  }

  async get(id: string, tx?: PrismaTransaction): Promise<TEntity | null> {
    const row = await this.withDatabaseErrorMapping(() =>
      this.delegate(tx).findUnique({ where: { id } }),
    )
    return row ? this.toDomain(row) : null
  }

  async exists(id: string, tx?: PrismaTransaction): Promise<boolean> {
    const count = await this.withDatabaseErrorMapping(() =>
      this.delegate(tx).count({ where: { id } }),
    )
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
      this.throwMappedDatabaseError(error)
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
      this.throwMappedDatabaseError(error)
    }
  }

  private async withDatabaseErrorMapping<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      this.throwMappedDatabaseError(error)
    }
  }

  private throwMappedDatabaseError(error: unknown): never {
    if (this.isDatabaseUnavailableError(error)) {
      throw new DatabaseUnavailableException()
    }

    throw error
  }

  private isDatabaseUnavailableError(error: unknown): boolean {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return true
    }

    let current: unknown = error

    while (typeof current === 'object' && current !== null) {
      if ('code' in current && DATABASE_UNAVAILABLE_ERROR_CODES.has(String(current.code))) {
        return true
      }

      current = 'cause' in current ? current.cause : undefined
    }

    return false
  }
}
