import type {IResourceTemplate, IResourceSpec} from '../../types.ts'
import type {Category} from './types.ts'

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

  toJSON() {
    return this.resource
  }

  toCreate(): Partial<Category> {
    return this.toUpdate()
  }

  toUpdate(): Partial<Category> {
    return {
      name: this.resource.name
    , type: this.resource.type
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
  static from(spec: {metadata: {pk: string}, spec: Partial<Category>}) {
    return {
      id: spec.metadata.pk
    , name: spec.spec.name
    , type: spec.spec.type
    }
  }
}
