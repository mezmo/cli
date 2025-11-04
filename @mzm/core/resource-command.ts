 //@ts-nocheck
import {MZMCommand} from './command.ts'
import * as resource from './resource/mod.ts'
import {Table, Cell, Row} from '@cliffy/table'
import {toTitleCase} from '@std/text/unstable-to-title-case'
import {EnumType} from '@cliffy/command'
import * as yaml from '@std/yaml'
import {toArray} from './lang/mod.ts'
import type {RowType} from '@cliffy/command'

type Namespace = Record<string, RowType[]>
const OutputFormat = new EnumType(['table', 'json', 'yaml'])

export default class ResourceCommand extends MZMCommand {
  #pk_field: string = 'id'
  #display_field: string = 'name'
  #group_by: string = ''
  #resource: string = ''
  #resource_version: string = 'v1'
  constructor(resource: string) {
    super()
    this.#resource = resource
    this.type('format', OutputFormat).option('-o, --output [format:format]', 'output only the resource identifiers', {default: 'table'})
  }
  async list<Type>(params?: Record<string, string>): Promise<Array<Type>> {
    const {data} = await (resource as unknown)[this.#resource_version][this.#resource].list(params)
    return data as Type[]
  }

  async get<Type>(identifer: string, params?: Record<string, string>): Promise<Type> {
    const result = await (resource as unknown)[this.#resource_version][this.#resource].get(identifer)
    return result as Type
  }

  pk(name: string): this {
    this.#pk_field  = name
    return this
  }

  groupby(name: string): this {
    this.#group_by = name
    return this
  }

  display(name: string): this {
    this.#display_field = name
    return this
  }

  render<Type>(input: Type | Array<Type>, format: string): string {
    switch(format) {
      case 'json': return this.toJSON(input)
      case 'yaml': return this.toYAML(input)
      default: return this.toTABLE(input)
    }
  }
  toJSON<Type>(input: Type | Array<Type>):string {
    return JSON.stringify(input, null, 2)
  }
  toYAML<Type>(input: Type | Array<Type>):string {
    return yaml.stringify(input)
  }
  toTABLE<Type>(input: Type | Array<Type>):string {
    const output = new Table().padding(8)
    const categories: Namespace = {}
    const body:RowType[] = []
    const items:Array<Type> = toArray(input)

    if (this.#group_by) {
      for (const item of items) {
        let grouper: string | undefined = Array.isArray(item[this.#group_by])
          ? item[this.#group_by][0]
          : item[this.#group_by]

        const category = toTitleCase(grouper ?? 'Uncategorized')
        const group = (categories[category] = categories[category] ?? [])

        group.push(
          [item[this.#display_field], item[this.#pk_field]]
        )
      }

      for (const [category, rows] of Object.entries(categories)) {
        const first_row = rows.shift()
        if (!first_row) continue
        body.push([new Cell(category).rowSpan(rows.length + 1), ...first_row])
        for (const row of rows) {
          body.push(row)
        }
      }
    }
    return output.body(body).toString()
  }
}

