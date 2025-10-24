
export default {
  typecast(value: any): any {
    if (value === 'null' || value === null) return null
    if (value === 'undefined' || value === undefined) return undefined
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    if (value === '' || isNaN(value)) return value
    if (isFinite(value)) return parseFloat(value)
    return value
  },
  upper(str:string | undefined | null): string {
    const val = (str === null || str === undefined) ? '' : str.toString()
    return val.toUpperCase()
  }
}
