import { EntityNotFoundException } from '@/common/application/exceptions/entity-not-found.exception'
import { ModuleEnum } from '@/common/module.enum'
import { ExampleEntity } from '@/modules/example-module/domain/example.entity'

export class ExampleNotFoundException extends EntityNotFoundException {
  public readonly module: ModuleEnum = ModuleEnum.EXAMPLE
  public readonly entityName: string = ExampleEntity.name

  constructor(public readonly id: string) {
    super(id)
  }
}
