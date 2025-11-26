import {join} from '@std/path'
import {ulid} from '@std/ulid'
import {default as resource, parse, stringify, StringifyFormat} from '@mzm/core/resource'

const DEFAULT_EDITOR: string = Deno.build.os == 'windows' ? 'notepad.exe' : 'vi'

export async function load(api_version: string, type: string, identifier: string, format: StringifyFormat): Promise<string> {
    const editor = Deno.env.get('EDITOR') ?? DEFAULT_EDITOR

   //@ts-ignore work around for array index typing
    const source = await resource[api_version][type].get(identifier)
    const dirname = await Deno.makeTempDir({prefix: 'mzm-edit'})
    const tmpfile = join(dirname,`${type}.${ulid()}.${format}`)
    await using file: Deno.FsFile = await Deno.open(tmpfile, {write: true, createNew: true})

    await file.write(new TextEncoder().encode(stringify(source, format)))
    file[Symbol.dispose]()

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
    return content
}

export async function apply(api_version: string, type: string, content: string) {
   //@ts-ignore work around for array index typing
    await resource[api_version][type].update(parse(content))
}
