import {EOL} from 'node:os'
import * as path from '@std/path'
import {MZMCommand, yaml, ValidationError} from '@mzm/core'
import {default as resource} from '@mzm/core/resource'
import {parse} from '@mzm/core/resource'

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
    const content = await Deno.readTextFile(location)
    const definition = parse(content)

    if (!definition) return

    const [version, kind] = definition.type?.split('/')

    if (!kind) {
      throw new ValidationError(`Resource definiton missing type declaration.`)
    }

    if (!Object.hasOwnProperty.call(resource, version)) {
      const versions = Object.keys(resource).sort().join(', ')
      throw new ValidationError(`Unknown version type ${version}. Must be one of: ${versions}`)
    }

    try {
      //@ts-ignore workaround for module indexing
      const spec = await resource[version][kind].getBySpec(definition.spec)

      //@ts-ignore workaround for module indexing
      await (resource)[version][kind].removeBySpec(spec)
      if (spec.pk) console.log(spec.pk)
    } catch (err) {
      console.dir(err)
    }
  })
