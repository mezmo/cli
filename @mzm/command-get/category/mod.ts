// @ts-nocheck ignore until command sub class types are figured out

import {EOL} from '@std/fs'
import {ResourceCommand} from '@mzm/core'
import {type Category, default as resource} from '@mzm/core/resource'

export default new ResourceCommand('category')
  .description([
    'Interact with Categories - Grouping and categorization labels for boards, views and screens'
  ].join(EOL))
  .apiVersion('v1')
  .pk('pk')
  .arguments('[category-id:string]')
  .usage('[id] [options]')
  .column({name: 'NAME', property: 'name'})
  .column({name: 'TYPE', property: 'type'})
  .column({name: 'ID', property: 'pk'})
  .action(async function(options: any, pk?: string) {
    const to_render: Category | Array<Category> = pk
    ? await resource.v1.category.get(pk)
    : await resource.v1.category.list()

    console.log(this.render(to_render, options.output))
  })
