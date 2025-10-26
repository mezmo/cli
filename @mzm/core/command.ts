import {Command} from '@cliffy/command'
import {Select} from '@cliffy/prompt/select'
import {toTitleCase} from '@std/text/unstable-to-title-case'
import {default as resource} from './resource/mod.ts'
import type {View} from './resource/mod.ts'

export class MZMCommand extends Command {
  constructor() {
    super()
    this.name('mzm')
    this.usage('[command] [options]')
    this.env(
      'MZM_ACCESS_KEY=<value:string>',
      'Mezmo Platform IAM Access Key',
      {prefix: 'MZM_'}
    )
  }

  async promptView() {
    const views = await this.views()
    const categories = new Map()
    for (const view of views) {
      const category_name = view.category[0] ?? 'Primary'
      const category = categories.get(category_name) ?? {
        name: toTitleCase(category_name)
      , options: [
        ]
      }

      category.options.push({name: view.name.trim(), value: view})
      categories.set(category_name, category)
    }

    const view = await Select.prompt({
      message: 'Select A View'
    , groupIcon: '\u00BB '
    , groupOpenIcon: '\u00AB '
    , maxRows: 20
    , options: Array.from(categories.values()).sort((a, b) => {
        if (a.name === 'Primary') return -1
        if (b.name === 'Primary') return 1

        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
      })
    })
    return view
  }

  async views(): Promise<Array<View>> {
    const {data} = await resource.view.list()
    return data
  }
}
