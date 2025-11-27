import type {View} from './types.ts'
import type {IResourceTemplate, IResourceSpec} from '../../types.ts'

export default class ViewSpec implements IResourceSpec<View> {
  resource: View
  constructor(options: View) {
    this.resource = options
  }

  [Symbol.toStringTag](): string {
    return 'ViewSpec'
  }

  get pk(): string {
    return this.resource.viewid
  }

  toJSON(): View {
    return this.resource
  }

  toCreate(): Partial<View> {
    return this.toUpdate()
  }

  toUpdate(): Partial<View> {
    return {
      name: this.resource.name
    , query: this.resource.query
    , tags: this.resource.tags?.length ? this.resource.tags : undefined
    , hosts: this.resource.hosts?.length ? this.resource.hosts : undefined
    , apps: this.resource.apps?.length ? this.resource.apps : undefined
    , presetid: this.resource.presetids?.length ? this.resource.presetids[0] : undefined
    , channels: this.resource.channels?.length ? this.resource.channels : undefined
    , levels: this.resource.levels?.length ? this.resource.levels : undefined
    , category: this.resource.category ?? []
    }
  }

  toTemplate(): IResourceTemplate {
    return {
      version: 'v1'
    , resource: 'view'
    , metadata: {
        pk: this.pk
      , account: this.resource.account
      }
    , spec: this.toUpdate()
    }
  }

  static from(spec: {metadata: {account: string, pk: string}, spec: Partial<View>}) {
    return new this({
      viewid: spec.metadata.pk
    , account: spec.metadata.account
    , name: spec.spec.name as string
    , query: spec.spec.query as string
    , tags: spec.spec.tags ?? undefined
    , hosts: spec.spec.hosts ?? undefined
    , apps: spec.spec.apps ?? undefined
    , presetids: spec.spec.presetids ?? []
    , channels: spec.spec.channels ?? undefined
    , levels: spec.spec.levels ?? undefined
    , category: spec.spec.category ?? []
    , orgs: spec.spec.orgs ?? []
    })
  }
}
