import { InfrastructureException } from '@/common/exceptions'
import { ModuleEnum } from '@/common/module.enum'

export class DatabaseUnavailableException extends InfrastructureException {
  public readonly module = ModuleEnum.COMMON

  public get message(): string {
    return 'Database is temporarily unavailable'
  }
}
