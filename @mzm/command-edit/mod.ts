import * as path from '@std/path'
import {EOL} from '@std/fs'
import {ulid} from '@std/ulid'
import {MZMCommand, EnumType} from '@mzm/core'
import {default as resource, parse, stringify} from '@mzm/core/resource'

const OutputFormat = new EnumType(['json', 'yaml'])
const DEFAULT_EDITOR: string = Deno.build.os == 'windows' ? 'notepad.exe' : 'vi'

export default new MZMCommand()
  .name('edit')
  .type('editformat', OutputFormat)
  .description([
    'The edit command allows you to edit api resources via the command line.'
  , 'It will open the resource in a text editor as specified by the EDITOR'
  , 'Environment variable, or vallback to vi on unix platform and notepad on windows.'
  , 'The default format is yaml. To edit in JSON, specifiy "-o json"'
  ].join(EOL))
  .arguments('<resource-id:string>')
  .option('-o, --output [format:editformat]', 'output only the resource identifiers', {default: 'yaml'})
  .example(
    'basic example'
  , 'mzm edit -ojson v1/view/7fb51dc261'
  )
  .action(async function(options: any, resource_id: string) {
    const editor = Deno.env.get('EDITOR') ?? DEFAULT_EDITOR

    const [version, type, identifier] = resource_id.split('/')
   //@ts-ignore work around for array index typing
    const source = await resource[version][type].get(identifier)
    const dirname = await Deno.makeTempDir({prefix: 'mzm-edit'})
    const tmpfile = path.join(dirname,`${type}.${ulid()}.${options.output}`)
    const file = await Deno.open(tmpfile, {write: true, createNew: true})

    await file.write(new TextEncoder().encode(stringify(source, options.output)))
    file.close()

    const cmd = new Deno.Command(editor, {
      args: [tmpfile]
    , stdout: 'inherit'
    , stderr: 'inherit'
    , stdin: 'inherit'
    })

    const process = cmd.spawn()
    const status = await process.status
    if (status.code !== 0) throw new Error('unable to save fild')
    const content = await Deno.readTextFile(tmpfile)
    await Deno.remove(tmpfile)

   //@ts-ignore work around for array index typing
    await resource[version][type].update(parse(content))
    console.log('resource updated')
  })
