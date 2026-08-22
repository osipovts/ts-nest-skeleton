import { v7 as uuidv7 } from 'uuid'

import type { PlainObject } from '../types'

export interface EntityInterface<TProps extends PlainObject = PlainObject> {
  id: string
  createdAt: Date
  updatedAt: Date
  props: TProps

  toFlatObject(): TProps & {
    id: EntityInterface<TProps>['id']
    createdAt: EntityInterface<TProps>['createdAt']
    updatedAt: EntityInterface<TProps>['updatedAt']
  }
}

export abstract class Entity<
  TProps extends PlainObject = PlainObject,
> implements EntityInterface<TProps> {
  constructor(
    public readonly props: TProps,
    public readonly id: string = uuidv7(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  toFlatObject(): TProps & {
    id: Entity<TProps>['id']
    createdAt: Entity<TProps>['createdAt']
    updatedAt: Entity<TProps>['updatedAt']
  } {
    const { props, id, createdAt, updatedAt } = this
    return { ...props, id, createdAt, updatedAt }
  }
}
