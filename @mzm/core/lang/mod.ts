import type {JSValue, Separator} from './types.ts'
const CSV_SEP_EXP: RegExp = /\s*,\s*/

export function toArray(item: JSValue, sep: Separator = CSV_SEP_EXP): Array<JSValue> {
  if (!item) return []
  if (item instanceof Set) return Array.from(item)
  if (Array.isArray(item)) return item
  return typeof item === 'string' ? item.split(sep) : [item]
}
