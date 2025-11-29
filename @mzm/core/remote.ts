import {join} from '@std/path'
import {ulid} from '@std/ulid'
import {colors} from '@cliffy/ansi/colors'
import {GenericError} from './error.ts'
import resource, {parse, stringify, type StringifyFormat} from './resource/mod.ts'
import type {IResourceTemplate} from './resource/types.ts'

const DEFAULT_EDITOR: string = Deno.build.os == 'windows' ? 'notepad.exe' : 'vi'

export async function load(version: string, type: string, identifier: string, format: StringifyFormat): Promise<string> {
    const editor = Deno.env.get('EDITOR') ?? DEFAULT_EDITOR

   //@ts-ignore work around for array index typing
    const api_version = resource[version]
   //@ts-ignore work around for array index typing
    const module = api_version[type]

    const Spec = module.Spec
    const fn = module.get

    const spec = new Spec(await fn(identifier))
    const dirname = await Deno.makeTempDir({prefix: 'mzm-edit'})
    const tmpfile = join(dirname,`${type}.${ulid()}.${format}`)

    await using file: Deno.FsFile = await Deno.open(tmpfile, {write: true, createNew: true})
    const source = spec.toTemplate()
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
    if (status.code !== 0) throw GenericError.from('unable to save fild')
    const content = await Deno.readTextFile(tmpfile)
    await Deno.remove(tmpfile)
    return content
}

export async function fromString(content: string, format?: StringifyFormat): Promise<string> {
  const editor = Deno.env.get('EDITOR') ?? DEFAULT_EDITOR

  //@ts-ignore work around for array index typing
  const dirname = await Deno.makeTempDir({prefix: 'mzm-staging'})
  const tmpfile = join(dirname,`from-string.${ulid()}.${format}`)

  await using file: Deno.FsFile = await Deno.open(tmpfile, {write: true, createNew: true})
  const transformed: string = format === 'json' ? stringify(parse(content), format) : content
  await file.write(new TextEncoder().encode(transformed))
  file[Symbol.dispose]()

  const cmd = new Deno.Command(editor, {
    args: [tmpfile]
  , stdout: 'inherit'
  , stderr: 'inherit'
  , stdin: 'inherit'
  })

  const process = cmd.spawn()
  const status = await process.status
  if (status.code !== 0) throw new Error('Unable to save resource file')
  const output = await Deno.readTextFile(tmpfile)
  await Deno.remove(tmpfile)
  return output
}

export async function apply(api_version: string, type: string, content: string) {
  //@ts-ignore work around for array index typing
  await resource[api_version][type].update(parse(content))
}

export async function applyTemplate<T>(content: string): Promise<T> {
  const template: IResourceTemplate = (parse(content) as unknown) as IResourceTemplate
  //@ts-ignore work around for module index typing
  const api_version = resource[template.version]

  if (!api_version) {
    const versions = Object.keys(resource).map(colors.yellow)
    throw GenericError.from(
      `Attempt to use an unsupported api version: ${colors.yellow(template.version)}`
    , `Supported API versions are one of ${versions.join(', ')}`
    , {code: 'EINVAL'}
    )
  }
  //@ts-ignore work around for module index typing
  const module = api_version[template.resource]

  if (!module) {
    const types = Object
    .keys(api_version)
    .filter((item) => {
      return item !== 'conversation'
    })
    .map(colors.yellow)

    throw GenericError.from(
      `Attempt to use an unsupported resource type: ${colors.yellow(template.resource)}`
    , `Supported ${template.version} resources must be one of: ${types.join(', ')}`
    , {code: 'EINVAL'}
    )
  }

  const Spec = module.Spec

  const spec = Spec.from(template)
  const pk = spec.pk
  const result = pk
    ? await module.update(spec)
    : await module.create(spec)


  return result as T
}
