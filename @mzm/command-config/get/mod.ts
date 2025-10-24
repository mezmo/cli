import {MZMCommand} from "@mzm/core"
import {storage} from '@mzm/config'
import {Table, RowType} from '@cliffy/table'

const get = new MZMCommand()
  .name('get')
  .usage('<name>')
  .example('Get specific key:', 'mzm config get core.host.api')
  .example('Get list of keys:', 'mzm config get core.*')
  .arguments('<key:string>')
  .description('get one or more configuration values')
  .action(async function(_, name: string) {
    const output  = new Table()
    output.header(['Namespace', 'Key', 'Value'])
    const body:RowType[] = []
    const entries = await storage.get(name)
    for await (const entry of entries) {
      if (!entry) continue
      const record: Record<any, any> = {...entry}
      const [namespace, ...key_path] = record.key
      body.push(
        [namespace, key_path.join('.'), record.value]
      )
    }

    output.body(body).padding(5).render()
  })

  export {get}
