import {EOL} from '@std/fs'
import {MZMCommand, EditFormat} from '@mzm/core'
import resource, {type Category} from '@mzm/core/resource'
import * as remote from '@mzm/core/remote'

export default new MZMCommand()
  .name('category')
  .type('editformat', EditFormat)
  .description([
    'The category subcommand allows you to create a single category resource from a template.'
  , 'It will open the resource in a text editor as specified by the EDITOR'
  , 'Environment variable, or fallback to vi on unix platform and notepad on windows.'
  , 'The default format is yaml. To edit in JSON, specifiy "-o json"'
  ].join(EOL))
  .group('Formatting options')
  .option('-o, --output [format:editformat]', 'output only the resource identifiers', {default: 'yaml'})
    //@ts-ignore work around for command subclassing
  .action(async function(options: any) {
    //@ts-ignore work around for command subclassing
    const content = await remote.fromString(resource.v1.category.template(), options.output, 'category')
    const category: Category = await remote.applyTemplate<Category>(content)
    console.log(category.pk)
  })
