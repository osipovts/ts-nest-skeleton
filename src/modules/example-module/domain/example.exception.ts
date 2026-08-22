import { DomainException } from '@/common/exceptions'
import { ModuleEnum } from '@/common/module.enum'

export abstract class MyDomainError extends DomainException {
  public readonly module = ModuleEnum.EXAMPLE
  public get message(): string {
    return 'Some error occurred'
  }
}
