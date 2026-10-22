import {debuglog} from 'node:util'
import {yaml} from '../mod.ts'
import type {IResourceTemplate} from './types.ts'
import * as  JSONC from '@std/jsonc'

const log = debuglog('core:resource')

export default function parse(content: string): IResourceTemplate | null {
  let definition: IResourceTemplate | null = null
  try {
    definition = yaml.parse(content) as IResourceTemplate
  } catch (err) {
    console.dir(err)
    log('unable to parse as yaml')
    try {
      const parsed = JSONC.parse(content)

      // thanks typescript :(
      if (parsed) definition = (parsed as unknown) as IResourceTemplate
    } catch {
      log('unable to parse resource definition')
    }
  }
  return definition
}
