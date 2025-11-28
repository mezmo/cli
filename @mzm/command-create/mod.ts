import {EOL} from 'node:os'
import {join, isAbsolute} from '@std/path'
import {MZMCommand, ValidationError} from '@mzm/core'
import {default as resource} from '@mzm/core/resource'
import {parse} from '@mzm/core/resource'

import ViewCommand from './view/mod.ts'
import CategoryCommand from './category/mod.ts'

export default new MZMCommand()
  .name('create')
  .usage('<options>')
  .description([
    'Create multiple resources from a file or stdin.'
  , 'JSON and YAML formats are accepted'
  ].join(EOL))
  .example('Create a new resource from a spec file:', 'mzm create -f spec.yaml')
  .option('-f, --file <file:string>', 'Path to a resource definition file.')
  .action(async function (options: any) {
    if (typeof options.file !== 'string') {
      throw new ValidationError('file option is required and must be a string;')
    }
    const file: string = options.file
    const location: string = isAbsolute(file) ? options.file : join(Deno.cwd(), file)
    const content = await Deno.readTextFile(location)
    const definition = parse(content)

    if (!definition) return

    const [version, kind] = definition.type?.split('/')

    if (!kind) {
      throw new ValidationError(`Resource definiton missing type declaration.`)
    }

    if (!Object.hasOwnProperty.call(resource, version)) {
      const versions = Object.keys(resource).sort().join(', ')
      throw new ValidationError(`Unknown version. Must be one of: ${versions}`)
    }

    //@ts-ignore workaround for module indexing
    if (!resource[version][kind]) {
      //@ts-ignore workaround for module indexing
      const types = Object.keys(resource[version]).join(', ')
      throw new ValidationError(
        `Unknown resource type ${version}/${kind}. Must be one of: ${types}`
      )
    }

    //@ts-ignore workaround for module indexing
    const result = await (resource)[version][kind].create(definition.spec)
    console.log(result.pk)
  })
  .command('category', CategoryCommand)
  .command('view', ViewCommand)
