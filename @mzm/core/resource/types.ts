
export enum StringifyFormat {
  JSON = 'json'
, YAML = 'yaml'
}

export interface IResourceDefinition {
  type: string
  spec: object
}

