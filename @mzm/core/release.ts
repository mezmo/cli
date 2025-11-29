import info_json from '../../release.json' with {type: 'json'}

type ReleaseInfo = {
  release_date: string
, version: string
}

export function info(): ReleaseInfo {
  return info_json
}
