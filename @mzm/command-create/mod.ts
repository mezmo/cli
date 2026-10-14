import * as fs from 'node:fs/promises'
import {EOL} from 'node:os'
import * as path from 'node:path'
import {MZMCommand, ValidationError} from '@mzm/core'
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
    const location: string = path.resolve(options.file)
    const content = await fs.readFile(location, 'utf8')
    const result: ResourceResponse = await remote.applyTemplate(content)
    console.log(result.pk)
  })
  .command('category', CategoryCommand)
  .command('view', ViewCommand)
