import type { Entity } from '@/common/domain/abstract.entity'

export interface RepositoryPort<TEntity extends Entity> {
  get(id: TEntity['id']): Promise<TEntity | null>
  exists(id: TEntity['id']): Promise<boolean>
  save(entity: TEntity): Promise<TEntity>
  delete(id: TEntity['id']): Promise<TEntity | null>
}
