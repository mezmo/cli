import {OutputFormat} from '../lib/enum.ts'
import * as remote from '../lib/remote.ts'
import {EOL} from '@std/fs'
import {MZMCommand} from '@mzm/core'

export default new MZMCommand()
  .name('view')
  .type('editformat', OutputFormat)
  .description([
    'The view subcommand allows you to edit a single view resource by its id.'
  , 'It will open the resource in a text editor as specified by the EDITOR'
  , 'Environment variable, or fallback to vi on unix platform and notepad on windows.'
  , 'The default format is yaml. To edit in JSON, specifiy "-o json"'
  ].join(EOL))
  .arguments('[view-id]')
  .group('Formatting options')
  .option('-o, --output [format:editformat]', 'output only the resource identifiers', {default: 'yaml'})
  .example(
    'edit a view in json format:'
  , 'mzm edit view -o json 7fb51dc261'
  )
  .example(
    'edit a view in yaml format:'
  , 'mzm edit view -o yaml 7fb51dc261'
  )
  .example(
    'edit a view by name:'
  , 'mzm edit view $(mzm get view -o json | jq -r \'.[] | select(.name=="My View Name") .pk\')'
  )
  .example(
    'edit a view from a list of available views:'
  , 'mzm edit view'
  )
    //@ts-ignore work around for command subclassing
  .action(async function(options: any, view_id: string) {
    //@ts-ignore work around for command subclassing
    const resource_id: string | undefined = view_id ? view_id : (await this.promptView())?.pk
    if (!resource_id) return
    
    const content = await remote.load('v1', 'view', resource_id, options.output)
    await remote.apply('v1', 'view', content)
    console.log(view_id)
  })
