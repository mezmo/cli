import {MZMCommand, ArgumentValue, ValidationError} from "@mzm/core"
import {storage} from '@mzm/config'
import {typeOf, str} from '@mzm/core/lang'

const VALID_TYPES: Set<string> = new Set([
  'number'
, 'string'
, 'boolean'
])

function valueType ({label, name, value}: ArgumentValue): string | number | boolean {
  const val = str.typecast(value)
  const value_type = typeOf(val)

  if (VALID_TYPES.has(value_type)) return val
  throw new ValidationError(
    `${label} "${name}" value must be one of a number, string, or boolean. Got ${value_type}`
  )
}

const set = new MZMCommand()
  .name('set')
  .type('configvalue', valueType)
  .description('set one or more configuration values')
  .arguments('<key:string> <value:configvalue>')
  .action(async function (_, key: string, value: string | number | boolean) {
    await storage.set(key, value)
    console.log(value)
  })

  export {set}
