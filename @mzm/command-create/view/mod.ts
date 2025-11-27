import {EOL} from '@std/fs'
import {MZMCommand, EditFormat} from '@mzm/core'
import resource, {type View} from '@mzm/core/resource'
import * as remote from '@mzm/core/remote'

export default new MZMCommand()
  .name('view')
  .type('editformat', EditFormat)
  .description([
    'The view subcommand allows you to create a single view resource from a template.'
  , 'It will open the resource in a text editor as specified by the EDITOR'
  , 'Environment variable, or fallback to vi on unix platform and notepad on windows.'
  , 'The default format is yaml. To edit in JSON, specifiy "-o json"'
  ].join(EOL))
  .group('Formatting options')
  .option('-o, --output [format:editformat]', 'output only the resource identifiers', {default: 'yaml'})
    //@ts-ignore work around for command subclassing
  .action(async function(options: any) {
    //@ts-ignore work around for command subclassing

    const content = await remote.fromString(await resource.v1.view.template(), options.output)
    const view: View = await remote.applyTemplate<View>(content)
    console.log(view.pk)
  })
