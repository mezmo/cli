import {MZMCommand, Table, Cell, RowType} from "@mzm/core"
import {typeOf} from "@mzm/core/lang"
import {storage} from '@mzm/config'

type Namespace = Record<string, RowType[]>

const get = new MZMCommand()
  .name('get')
  .usage('<name>')
  .example('Get specific key:', 'mzm config get core.host.api')
  .example('Get list of keys:', 'mzm config get core.*')
  .arguments('[key:string]')
  .description('get one or more configuration values')
  .action(async function(_: unknown, name: string = '*') {
    const output  = new Table()
    output.header(['Namespace', 'Key', 'Value'])
    const namespaces: Namespace = {}
    const body: RowType[] = []
    const entries = await storage.get(name)
    for await (const entry of entries) {
      if (!entry) continue
      const record: Record<string, any> = {...entry}
      const namespace = record.key[0]
      const group = (namespaces[namespace] = namespaces[namespace] ?? [])
      let display = ''

      switch (typeOf(record.value)) {
        case 'object': {
          display = '<object>'
          break
        }
        case 'array': {
          display = `<list: ${record.value.length}>`
          break
        }
        default: {
          display = record.value
        }
      }
      group.push([
        record.key.join('.')
      , display
      ])
    }

    for (const [namespace, rows] of Object.entries(namespaces)) {
      const first_row = rows.shift()
      if (!first_row) continue
      body.push([new Cell(namespace).rowSpan(rows.length + 1), ...first_row])
      for (const row of rows) {
        body.push(row)
      }
    }
    output.body(body).padding(8).render()
  })

  export {get}
