import {MZMCommand} from '@mzm/core'
import resource from '@mzm/core/resource'

export default new MZMCommand()
  .name('conversation')
  .description('Delete one or more conversations from history')
  .arguments('<identifiers...:string>')
  .example('Delete a single conversation:', 'mzm delete conversation cs_a3d194')
  .example('Delete many conversations:', 'mzm delete conversation cs_a3d194 cs_fab3134')
  .action(async function (_, ...identifiers) {
    const response = await resource.v1.conversation.remove(identifiers)
    console.log(response.map((row) => {
      return row.pk
    }).join(' '))
  })
