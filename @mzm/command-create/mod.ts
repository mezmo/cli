import {EOL} from 'node:os'
import {join, isAbsolute} from '@std/path'
import {MZMCommand, ValidationError} from '@mzm/core'
import {default as resource} from '@mzm/core/resource'
import {parse, type IResourceTemplate} from '@mzm/core/resource'
import * as remote from '@mzm/core/remote'

import ViewCommand from './view/mod.ts'
import CategoryCommand from './category/mod.ts'

interface ResourceResponse {
  pk: string
}

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
    const result: ResourceResponse = await remote.applyTemplate(content)
    console.log(result.pk)
  })
  .command('category', CategoryCommand)
  .command('view', ViewCommand)
