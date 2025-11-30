
export enum StringifyFormat {
  JSON = 'json'
, YAML = 'yaml'
}

export interface IResourceDefinition {
  type: string
  spec: Record<string, unknown>
}

export interface IResourceTemplate {
  version: 'v1' | 'v2' | 'v3'
, resource: 'view' | 'category'
, metadata: Record<string, string>
, spec: Record<string, unknown>
}

export interface IResourceSpec<T> {
  toJSON(): T
, toTemplate(): IResourceTemplate
, toUpdate(): unknown
, toCreate(): unknown
}
