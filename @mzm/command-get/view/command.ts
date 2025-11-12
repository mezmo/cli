import {MZMCommand, EnumType, Table, Cell, RowType, toTitleCase, yaml} from '@mzm/core'
import {default as resource} from '@mzm/core/resource'
import type {View} from '@mzm/core/resource'
type Namespace = Record<string, RowType[]>

const OutputFormat = new EnumType(['table', 'json', 'yaml'])
export default new MZMCommand()
  .name('view')
  .description('Interact with views - Predefined sets of log queries')
  .example(
    'List all views:'
  , 'mzm get view'
  )
  .example(
    'list all views in json format:'
  , 'mzm get view -o json'
  )
  .example(
    'Get a specific view by id:'
  , 'mzm get view 3f4bca174'
  )
  .example(
    'Get a specific view by name: '
  , 'mzm get view "my first view"'
  )
  .arguments('[id:string]')
  .option('-c, --category <category:string>', 'Specific viescategories to include', {collect: true})
  .option('-q, --quiet', 'output only the resource identifiers', {default: false})
  .type('format', OutputFormat)
  .option('-o, --output [format:format]', 'Print the outout in a specific format', {default: 'table'})
  .action(async function(options: any, view_id?: string) {
    const output = new Table().padding(8)

    const body: RowType[] = []
    if (view_id) {
      output.header(['Category', 'Name', 'Apps', 'Hosts', 'Query'])
      const view: View | null = await resource.v1.view.get(view_id)

      if (options.quiet) return view && console.log(view.viewid)

      if (!view) return output.render()
      switch(options.output) {
        case 'json': {
          return console.log(JSON.stringify(view, null, 2))
        }
        case 'yaml': {
          return console.log(yaml.stringify(view))
        }
        case 'table': {
          body.push([
            toTitleCase((view.category[0] ?? 'Uncategorized'))
          , view.name
          , view.apps?.join?.(', ')
          , view.hosts?.join?.(', ')
          , view.query
          ])
          return output.body(body).render()
        }
      }
    }

    const {data: views} = await resource.v1.view.list()
    switch(options.output) {
      case 'json': {
        return console.log(JSON.stringify(views, null, 2))
      }
      case 'yaml': {
        return console.log(yaml.stringify(views))
      }
      case 'table': {
        output.header(['Category', 'Name', 'ID'])
        if (options.quiet) return console.log(views.map((view: View) => {return view.viewid}).join(' '))
        const categories: Namespace = {}
        for (const view of views) {
          const category = toTitleCase(view.category[0] ?? 'Uncategorized')
          const group = (categories[category] = categories[category] ?? [])
          group.push(
            [view.name, view.viewid]
          )
        }

        for (const [category, rows] of Object.entries(categories)) {
          const first_row = rows.shift()
          if (!first_row) continue
          body.push([new Cell(category).rowSpan(rows.length + 1), ...first_row])
          for (const row of rows) {
            body.push(row)
          }
        }
        output.body(body).render()
      }
    }
  })
