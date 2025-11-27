import {EOL} from '@std/fs'
import {MZMCommand, EditFormat} from '@mzm/core'
import resource from '@mzm/core/resource'
import * as remote from '@mzm/core/remote'

export default new MZMCommand()
  .name('category')
  .type('editformat', EditFormat)
  .description([
    'The category subcommand allows you to edit a single category resource by its id.'
  , 'It will open the resource in a text editor as specified by the EDITOR'
  , 'environment variable, or fallback to vi on unix platform and notepad on windows.'
  , 'The default format is yaml. To edit in JSON, specifiy "-o json"'
  ].join(EOL))
  .arguments('[category-id]')
  .group('Formatting options')
  .option('-o, --output [format:editformat]', 'output only the resource identifiers', {default: 'yaml'})
  .example(
    'edit a category in json format:'
  , 'mzm edit category -o json 7fb51dc261'
  )
  .example(
    'edit a category in yaml format:'
  , 'mzm edit category -o yaml 7fb51dc261'
  )
  .example(
    'edit a category by name:'
  , 'mzm edit category "Category One"'
  )
  .example(
    'edit a category by name via subs shell:'
  , 'mzm edit category $(mzm get category -o json | jq -r \'.[] | select(.name=="My View Name") .pk\')'
  )
  .example(
    'edit a category from a list of available categories:'
  , 'mzm edit category'
  )
    //@ts-ignore work around for command subclassing
  .action(async function(options: any, category_id: string) {
    //@ts-ignore work around for command subclassing
    const resource_id: string | undefined = category_id
      ? category_id
      : (await resource.v1.category.prompt())?.pk

    if (!resource_id) return

    const content = await remote.load('v1', 'category', resource_id, options.output)
    await remote.apply('v1', 'category', content)
    console.log(category_id)
  })
