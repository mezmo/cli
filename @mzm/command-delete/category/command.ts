import {MZMCommand} from '@mzm/core'
import resource from '@mzm/core/resource'

export default new MZMCommand()
  .name('category')
  .description('Delete one or more categories')
  .arguments('[identifiers...:string]')
  .example('Delete a single category:', 'mzm delete category a3d194')
  .example('Delete many category:', 'mzm delete category a3d194 fab3134')
  .action(async function (_: any, ...identifiers: Array<string>) {
    const removed: Array<string> = []
    const ids = identifiers.length
      ? identifiers
      : [(await resource.v1.category.prompt())?.pk].filter(Boolean)

    for (const category_id of ids) {
      // @ts-ignore I don't think its possible for category_id to be nullish
      const pk = await resource.v1.category.remove(category_id)
      // @ts-ignore I don't think its possible for category_id to be nullish
      if (pk) removed.push(pk)
    }
    console.log(removed.join(' '))
  })
