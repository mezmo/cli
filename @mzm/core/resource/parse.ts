import {yaml} from '../mod.ts'
import {getLogger} from '@mzm/log'
import type {IResourceDefinition} from './types.ts'

const log = getLogger('default')

export default async function parse(file: string): Promise<IResourceDefinition> {
  let definition: IResourceDefinition = {type: '', spec: {}}
  let content = ''
    try {
      content = await Deno.readTextFile(file)
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        log.error(`Unable to read ${location}`)
        return definition
      }
    }
  try {
    definition = yaml.parse(content) as IResourceDefinition
  } catch (err) {
    console.dir(err)
    log.error('unable to parse as yaml')
    try {
      definition = JSON.parse(content)
    } catch {
      log.error('unable to parse resoruce definition')
    }
  }
  return definition
}
