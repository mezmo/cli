import {yaml} from '../mod.ts'
import {getLogger} from '@mzm/log'
import type {IResourceTemplate} from './types.ts'
import * as  JSONC from '@std/jsonc'

const log = getLogger('default')

export default function parse(content: string): IResourceTemplate | null {
  let definition: IResourceTemplate | null = null
  try {
    definition = yaml.parse(content) as IResourceTemplate
  } catch (err) {
    console.dir(err)
    log.error('unable to parse as yaml')
    try {
      const parsed = JSONC.parse(content)

      // thanks typescript :(
      if (parsed) definition = (parsed as unknown) as IResourceTemplate
    } catch {
      log.error('unable to parse resoruce definition')
    }
  }
  return definition
}
