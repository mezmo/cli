import {debuglog} from 'node:util'
import {Command} from '@cliffy/command'
import {Select} from '@cliffy/prompt/select'
import {levenshteinDistance, compareSimilarity} from '@std/text'
import {toTitleCase} from '@std/text/unstable-to-title-case'
import {default as resource} from './resource/mod.ts'
import type {View} from './resource/mod.ts'

const debug = debuglog('core:command')

//FIXME(esatterwhite): move the view specific stuff to the resource package
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
    this.env(
      'NO_COLOR=<value:boolean>',
      'Suppress ANSI color formatting',
    )
  }

  async promptView(seed?: Array<View>, message: string = 'Select A View'): Promise<View> {
    const views = seed ?? await this.views()
    const categories = new Map()
    for (const view of views) {
      const category_name = view.category[0] ?? 'Uncategorized'
      const category = categories.get(category_name) ?? {
        name: toTitleCase(category_name)
      , options: [
        ]
      }

      category.options.push({name: view.name.trim(), value: view})
      categories.set(category_name, category)
    }

    const view = await Select.prompt({
      message: message
    , groupIcon: '\u00BB '
    , groupOpenIcon: '\u00AB '
    , maxRows: 20
    , options: Array.from(categories.values()).sort((a, b) => {
        if (a.name === 'Uncategorized') return -1
        if (b.name === 'Uncategorized') return 1

        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
      })
    })
    return view
  }

  async views(): Promise<Array<View>> {
    const {data} = await resource.v1.view.list()
    return data
  }

  // the api doesn't support filtering
  async findView(match: string): Promise<View> {
    const views = await this.views()
    const potential_matches: Array<View> = []
    const to_match = match.toLowerCase()
    debug(`looking for view ${to_match}`)
    for (const view of views) {
      if (view.viewid === match) return view
      const name = view.name.toLowerCase()

      if (name === to_match) {
        debug('found exact name match: %s', view.name)
        return view
      }

      const name_includes = name.includes(to_match)
      const name_distance = levenshteinDistance(
        name.replace(/\s+/g, '')
      , to_match.replace(/\s+/g, '')
      )

      const name_close = name_distance <= Math.floor(match.length / 2)

      if (name_includes || name_close) {
        debug(`adding potential match: ${name}`)
        potential_matches.push(view)
      }
    }

    const comparator = compareSimilarity(to_match)
    const view = await this.promptView(
      potential_matches.sort((a: View, b: View) => {
        return comparator(a.name, b.name)
      })
    , 'Select A Similar View'
    )
    debug('view selected %s', view.name)
    return view
  }
}
