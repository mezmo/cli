import type {IResourceTemplate, IResourceSpec} from '../../types.ts'
import type {Category, CATEGORY} from './types.ts'

export default class CategorySpec implements IResourceSpec<Category> {
  resource: Category
  constructor(options: Category) {
    this.resource = options
  }
  [Symbol.toStringTag](): string {
    return 'CategorySpec'
  }

  get pk(): string {
    return this.resource.id
  }

  get type(): string {
    return this.resource.type
  }

  toJSON() {
    return this.resource
  }

  toCreate(): Partial<Category> {
    return this.toUpdate()
  }

  toUpdate(): Partial<Category> {
    return {
      name: this.resource.name
    }
  }

  toTemplate(): IResourceTemplate {
    return {
      version: 'v1'
    , resource: 'category'
    , metadata: {
        pk: this.pk
      , type: this.resource.type
      }
    , spec: {
        name: this.resource.name
      }
    }
  }
  static from(spec: {metadata: {pk: string, type: string}, spec: Partial<Category>}) {
    return new this({
      id: spec.metadata.pk
    , type: spec.metadata.type as CATEGORY
    , name: spec.spec.name as string
    })
  }
}
