
export function get(obj?: any, property: string = '', sep: string = '.') {
  if (obj == null || property == null) return undefined
  if (typeof property !== 'string') {
    throw new TypeError(
      'second argument to object.getProperty must be a string'
    )
  }

  if (sep && typeof sep !== 'string') {
    throw new TypeError(
      'third argument to object.getProperty must be a string'
    )
  }

  const parts = property.split(sep)
  let ret = obj
  const last = parts.pop() ?? ''
  let prop
  while ((prop = parts.shift())) {
    ret = ret[prop]

    /* eslint-disable-next-line no-eq-null */
    if (ret == null) return ret
  }

  return ret[last]
}
