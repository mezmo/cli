import {MZMCommand} from '@mzm/core'
import resource from '@mzm/core/resource'

export default new MZMCommand()
  .name('view')
  .description('Delete one or more views')
  .arguments('<identifiers...:string>')
  .example('Delete a single view:', 'mzm delete conversation a3d194')
  .example('Delete many view:', 'mzm delete conversation a3d194 fab3134')
  .action(async function (_: any, ...identifiers: Array<string>) {
    const removed: Array<string> = []
    for (const view_id of identifiers) {
      await resource.v1.view.remove(view_id)
      removed.push(view_id)
    }
    console.log(removed.join(' '))
  })
