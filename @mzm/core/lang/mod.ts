import type {JSValue, Separator} from './types.ts'
export {default as str} from './string.ts'

const CSV_SEP_EXP: RegExp = /\s*,\s*/
const TYPE_EXP = /^\[object (.*)\]$/
const toString = Object.prototype.toString

export function toArray(item: JSValue, sep: Separator = CSV_SEP_EXP): Array<JSValue> {
  if (!item) return []
  if (item instanceof Set) return Array.from(item)
  if (Array.isArray(item)) return item
  return typeof item === 'string' ? item.split(sep) : [item]
}

export function typeOf(value: JSValue): string {
  const parts = TYPE_EXP.exec(toString.call(value))
  if (!parts) return 'unknown'

  return parts[1].toLowerCase()
}
