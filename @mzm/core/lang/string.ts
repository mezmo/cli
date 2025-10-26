
import type {JSValue} from './types.ts'

export default {
  typecast(value: JSValue): JSValue {
    if (value === 'null' || value === null) return null
    if (value === 'undefined' || value === undefined) return undefined
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    if (value === '' || isNaN(value as number)) return value as JSValue
    if (isFinite(value as number)) return parseFloat(value as string)
    return value
  },
  upper(str: JSValue): string {
    const val = (str === null || str === undefined) ? '' : str.toString()
    return val.toUpperCase()
  }
}
