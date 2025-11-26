import {EOL} from '@std/fs'
import {MZMCommand} from '@mzm/core'
import {OutputFormat} from './lib/enum.ts'
import * as remote from './lib/remote.ts'
import ViewCommand from './view/command.ts'
import CategoryCommand from './category/command.ts'

export default new MZMCommand()
  .name('edit')
  .type('editformat', OutputFormat)
  .description([
    'The edit command allows you to edit api resources via the command line.'
  , 'It will open the resource in a text editor as specified by the EDITOR'
  , 'Environment variable, or fallback to vi on unix platform and notepad on windows.'
  , 'The default format is yaml. To edit in JSON, specifiy "-o json"'
  ].join(EOL))
  .arguments('[resource-id:string]')
  .group('Formatting options')
  .option('-o, --output [format:editformat]', 'output only the resource identifiers', {default: 'yaml'})
  .example(
    'basic example'
  , 'mzm edit -o json v1/view/7fb51dc261'
  )
  // @ts-ignore workaround for command sub classing
  .action(async function(options: any, resource_id: string) {
    const [version, type, identifier] = resource_id.split('/')
    const content = await remote.load(version, type, identifier, options.output)
    await remote.apply(version, type, content)
    console.log('resource updated')
  })

  .command('category', CategoryCommand)
  .command('view', ViewCommand)
