import { Entity } from '@/common/domain/abstract.entity'
import type { PlainObject } from '@/common/types'

export interface ExampleEntityData extends PlainObject {
  text: string
}

export class ExampleEntity extends Entity<ExampleEntityData> {}
