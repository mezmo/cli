import {join, dirname, fromFileUrl} from '@std/path'

const current_directory = dirname(fromFileUrl(import.meta.url))
const project_root = join(current_directory, '..', '..')
const info_file = join(project_root, 'release.info')

type ReleaseInfo = {
  release_date: string
, version: string
}

export async function info(): Promise<ReleaseInfo> {
  const pkg_text = await Deno.readTextFile(info_file)
  return JSON.parse(pkg_text)
}

export function infoSync(): ReleaseInfo {
  const pkg_text = Deno.readTextFileSync(info_file)
  return JSON.parse(pkg_text)
}
