import type { Entity } from '@/common/domain/abstract.entity'
import { ApplicationException } from '@/common/exceptions'
import type { ModuleEnum } from '@/common/module.enum'

export abstract class EntityNotFoundException extends ApplicationException {
  public abstract readonly module: ModuleEnum
  public abstract readonly entityName: string
  get message(): string {
    return `${this.entityName} with id ${this.entityId} not found`
  }

  constructor(public readonly entityId: Entity['id']) {
    super()
  }
}
