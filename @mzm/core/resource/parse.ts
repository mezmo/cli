import {yaml} from '../mod.ts'
import {getLogger} from '@mzm/log'
import type {IResourceDefinition} from './types.ts'

const log = getLogger('default')

export default function parse(content: string): IResourceDefinition {
  let definition: IResourceDefinition = {type: '', spec: {}}
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
