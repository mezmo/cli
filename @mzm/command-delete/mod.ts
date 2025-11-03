import {EOL} from 'node:os'
import * as path from '@std/path'
import {MZMCommand, yaml, ValidationError} from '@mzm/core'
import {getLogger} from '@mzm/log'
import {default as resource} from '@mzm/core/resource'
import {parse} from '@mzm/core/resource'

const log = getLogger('default')
export default new MZMCommand()
  .name('delete')
  .description([
    'Delete resources from a file or stdin.'
  ].join(EOL))
  .option('-f, --file <file:string>', 'Path to a resource definition file.')
  .action(async function (options: any) {
    if (typeof options.file !== 'string') {
      throw new ValidationError('file option is required and must be a string;')
    }
    const file: string = options.file
    const location: string = path.isAbsolute(file) ? options.file : path.join(Deno.cwd(), file)
    const definition = await parse(location)

    if (!definition) return

    const [version, kind] = definition.type?.split('/')

    if (!kind) {
      throw new ValidationError(`Resource definiton missing type declaration.`)
    }

    if (!Object.hasOwnProperty.call(resource, version)) {
      const types = Object.keys(resource).sort().join(', ')
      throw new ValidationError(`Unknown resource type ${kind}. Must be one of: ${types}`)
    }

    try {
      //@ts-ignore workaround for module indexing
      const spec = await resource[version][kind].getBySpec(definition.spec)

      console.log('deleting resource %o', spec)
      //@ts-ignore workaround for module indexing
      const result = await (resource)[version][kind].removeBySpec(spec)
    } catch (err) {
      console.dir(err)
    }
  })
