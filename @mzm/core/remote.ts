import * as fs from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {ulid} from '@std/ulid'
import {colors} from '@cliffy/ansi/colors'
import {GenericError} from './error.ts'
import resource, {parse, stringify, type StringifyFormat} from './resource/mod.ts'
import type {IResourceTemplate} from './resource/types.ts'
import {WINDOWS} from './platform.ts'

const DEFAULT_EDITOR: string = WINDOWS ? 'notepad.exe' : 'vi'

export async function load(version: string, type: string, identifier: string, format: StringifyFormat): Promise<string> {
    const editor = process.env.EDITOR ?? DEFAULT_EDITOR

   //@ts-ignore work around for array index typing
    const api_version = resource[version]
   //@ts-ignore work around for array index typing
    const module = api_version[type]

    const Spec = module.Spec
    const fn = module.get

    const spec = new Spec(await fn(identifier))
    const dirname = await fs.mkdtemp(join(tmpdir(), 'mzm-edit'))
    const tmpfile = join(dirname,`${type}.${ulid()}.${format}`)

    const source = spec.toTemplate()
    await Bun.write(tmpfile, stringify(source, format))

    const child = Bun.spawn([editor, tmpfile], {
      stdout: 'inherit'
    , stderr: 'inherit'
    , stdin: 'inherit'
    })

    const code = await child.exited
    if (code !== 0) throw GenericError.from(
      'Unable to save resource file'
    , `Make sure the directory ${dirname} accessible and can be written to`
    , {code: 'ENOIO'}
    )
    const content = await Bun.file(tmpfile).text()
    await fs.rm(tmpfile)
    return content
}

export async function fromString(content: string, format?: StringifyFormat, file_name: string = 'from-string'): Promise<string> {
  const editor = process.env.EDITOR ?? DEFAULT_EDITOR

  const dirname = await fs.mkdtemp(join(tmpdir(), 'mzm-staging'))
  const tmpfile = join(dirname,`${file_name}.${ulid()}.${format}`)

  //TODO(esatterwhite): this should throw if we can't parse it
  const transformed: string = format === 'json' ? stringify(parse(content) ?? {}, format) : content
  await Bun.write(tmpfile, transformed)

  const child = Bun.spawn([editor, tmpfile], {
    stdout: 'inherit'
  , stderr: 'inherit'
  , stdin: 'inherit'
  })

  const code = await child.exited
  if (code !== 0) throw GenericError.from(
    'Unable to save resource file'
  , `Make sure the directory ${dirname} accessible and can be written to`
  , {code: 'ENOIO'}
  )
  const output = await Bun.file(tmpfile).text()
  await fs.rm(tmpfile)
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
