import {homedir} from 'node:os'
import {debuglog} from 'node:util'
import {dirname} from '@std/path'
import {storage} from '@mzm/config'
import {date} from '@mzm/core/lang'
import {colors} from '@mzm/core'
import {equals as semverEqual, parse, compare, tryParse, format} from '@std/semver'
import {Table, Cell, type RowType} from '@cliffy/table'
import {ValidationError} from '@cliffy/command'
import {Provider, type UpgradeCommandOptions} from "@cliffy/command/upgrade"
import type {GithubProviderOptions} from "@cliffy/command/upgrade/provider/github"
import {GenericError} from '../../error.ts'
import {
  createClient
, RequestClient
, type RequestError
, type RequestResponse
} from '@anitrend/request-client'

const debug = debuglog('core:command:upgrade:provider')
const DEFAULT_DOWNLOAD_TIMEOUT = 1000 * 60 * 5
type CurrentOS = typeof Deno.build.os
type CurrentArch = typeof Deno.build.arch

type AssetMap = {
  [OS in CurrentOS]?: {
    [ARCH in CurrentArch]: string | null
  }
}

type OnCompleteMetadata = {
  to: string
  from?: string
};

type ReleaseMetadata = {
  created_at: string
  tag: string
}

type PrintOptions = {
  maxCols? :number
, indent?: number
, latest_version: ReleaseMetadata
}

type OnCompleteFinalCallback = () => void;

function sortVersions(left: ReleaseMetadata, right: ReleaseMetadata): number {
  const parsed = {
    left: parse(left.tag)
  , right: parse(right.tag)
  }

  if (!parsed.left && !parsed.right) return 0

  return compare(parsed.right, parsed.left)
}

type GithubRelease = {
  draft?: boolean
, prerelease?: boolean
, tag_name: string
, created_at: string
}

interface GithubReleasesProviderOptions extends GithubProviderOptions {
  repository: string
  spinner?: boolean;
  asset_map: AssetMap;
  onComplete?: (
    metadata: OnCompleteMetadata,
    cb: OnCompleteFinalCallback,
  ) => void | never;
  onError?: (error: GHError) => void | never;
}

type GithubReleaseVersions = {
  versions: string[];
  latest: string;
};

export class GHError extends Error {
  code: number;
  metadata: Record<string, unknown>;
  constructor(message: string, code: number, metadata = {}) {
    super(message);
    this.code = code;
    this.metadata = metadata;
  }
}

function noopComplete(_meta: OnCompleteMetadata, _cb: OnCompleteFinalCallback) {}
function noopError(_error: Error) {}

export default class GithubReleaseProvider extends Provider {
  name: string = "GithubReleaseProvider"
  spinner: boolean = true
  owner: string
  repo: string
  asset_map: AssetMap
  onComplete?: (metadata: OnCompleteMetadata, cb: OnCompleteFinalCallback) => void | never;
  onError?: (error: GHError) => void | never
  client: RequestClient
  constructor(options: GithubReleasesProviderOptions) {
    super(options)
    const [owner, repo] = options.repository.split("/")

    if (!owner || !repo) {
      const error = new GHError("repository must be in the format 'owner/repo'", 1, {
        repository: options.repository
      })

      this.onError?.(error)
      throw error
    }
    this.owner = owner
    this.repo = repo
    this.asset_map = options.asset_map

    if (typeof options.spinner === 'boolean') this.spinner = options.spinner

    this.onComplete = options?.onComplete || noopComplete
    this.onError = options?.onError || noopError
    this.client = createClient({
      baseURL: `https://api.github.com/`
    , timeout: 1000 * 60 * 10
    , responseType: 'json'
    })
  }

  // this is here to appease the abstract class implementation
  // I don't think this is used for anything
  getRepositoryUrl(_name: string): string {
    return `https://github.com/${this.owner}/${this.repo}/releases`
  }

  // here to appease the abstract class implementation
  getRegistryUrl(_name: string, version: string): string {
    return `https://github.com/${this.owner}/${this.repo}/releases/tag/${version}`
  }

  override async isOutdated(name: string, current: string, target: string): Promise<boolean> {
    const version_history= await this.getVersions(name)
    //@ts-ignore typescript is wrong
    const versions = version_history.versions as Array<ReleaseMetadata>
    //@ts-ignore typescript is wrong
    const latest = version_history.latest as ReleaseMetadata
    const target_version = (target === 'latest') ? tryParse(latest.tag) : tryParse(target)

    const current_version = parse(current)
    const latest_version = parse(latest.tag)

    const matched_version = versions.find((version) => {
      if (!target_version) return false
      return semverEqual(parse(version.tag), target_version)
    })

    // you are doing it wrong
    if (!target_version || !matched_version) {
      const repository_url = colors.brightBlue(this.getRepositoryUrl(name))

      throw new ValidationError([
        `The provided version ${colors.bold(colors.red(target))} is not found.`
       , `${colors.cyan('Visit')} ${repository_url} for available releases or run again `
            + `with ${colors.yellow('-l')} or ${colors.yellow('--list-versions')}.`
      ].join('\n'))
    }

    // already running the latest
    if (latest && semverEqual(latest_version, current_version) && semverEqual(latest_version, target_version)){
      this.logger.warn(
        `${colors.yellow('\u2605')} Already up to date!`
      )
      return false
    }

    // already running the version requested
    if (semverEqual(current_version, target_version)) {
      this.logger.warn(
        `${colors.green('\u2713')} You are currently running version ${colors.yellow(current)} of ${colors.yellow(name)}`
      )
      return false
    }

    debug('upgrade can proceed to %s', format(target_version))
    return true
  }

  // @ts-ignore The options type isn't exported
  override async upgrade(options): Promise<void> {
    // user input is string, us resolving a version from latest is ReleaseMetadata
    const to = typeof options.to === 'string' ? options.to : options.to.tag
    const from = options.from
    const {os, arch} = Deno.build
    const running_bin = await Deno.realPath(Deno.execPath())
    // HACK: The calling parent is a top level function that expectes this to be a string
    // And there is no way to change it
    options.to = to

    debug('%o', {to, from, os, arch})
    if (Deno.execPath().endsWith('deno')) {
      throw GenericError.from('In-Place upgrade is only supported for compiled binaries')
    }

    const os_map = this.asset_map[os]
    if (!os_map) throw GenericError.from(`unsupported os: ${os}`)

    const asset_name = os_map[arch]
    if (!asset_name) throw GenericError.from(`unsupported architecture [${arch}] on ${os}`)

    try {
      const timeout = parseInt(await storage.getOne('core.upgrade.timeout') as string)
      const tmp_file = await Deno.makeTempFile({prefix: 'mzm-'})
      const response = await fetch(`https://github.com/${this.owner}/${this.repo}/releases/download/${to}/${asset_name}`, {
        signal: AbortSignal.timeout(isNaN(timeout) ? DEFAULT_DOWNLOAD_TIMEOUT : timeout)
      })

      await using file_handle: Deno.FsFile = await Deno.open(tmp_file, {create: true, write: true})
      if (response.body) await response.body.pipeTo(file_handle.writable)

      await Deno.chmod(tmp_file, 0o776)

      // remove the current one
      debug('removing %s', running_bin)
      await Deno.remove(running_bin)

      // copy tmp file to <file>
      // moving / and $HOME likely spans devices, which makes simple rename not possible
      // poor mans mv (copy + remove)
      debug(`copy %s to %s`, tmp_file, running_bin)
      await Deno.copyFile(tmp_file, running_bin)

      // its not terribly important that the temp file is removed
      await Promise.allSettled([Deno.remove(tmp_file)])
    } catch (err: any) {
      const repository_url = colors.brightBlue(this.getRepositoryUrl('mzm'))
      if (err.name === 'TimeoutError') throw GenericError.from(
        `There was a problem downloading the ${to} release\n`
        + 'Looks like it just took too long. Make sure your internet connection is reasonably fast\n'
        + `Additionally, verify there are no current problems reported on ${colors.yellow('https://status.github.com')}`
      )

      throw GenericError.from(
        `There was a problem downloading the ${to} release`
      , `Make sure the release is currently available from ${repository_url}`
      , (err as Error).message
      )
    }
  }

  override async getVersions(_name: string): Promise<GithubReleaseVersions> {
    let response: RequestResponse;

    try {
      response = await this.client.get(`repos/${this.owner}/${this.repo}/releases`, {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    } catch (err) {
      const error = new GHError(
        'failed to get version list'
      , (err as RequestError)?.response?.status ?? 500
      )
      this.onError?.(error)
      throw error
    }
  
    const body = response?.data as Array<GithubRelease> ?? []

    const versions = body
      .filter((release) => {
        if (release.draft) return false
        if (release.prerelease) return false
        return true
      })
      .map((value) => {
        return {created_at: value.created_at, tag: value.tag_name}
      })
      .sort(sortVersions)

    // @ts-ignore typescript is wrong
    return {versions: versions, latest: versions[0]}
  }

  override async listVersions(name: string, installed_version: string): Promise<void> {
    const {versions, latest} = await this.getVersions(name)
    // @ts-ignore typescript is wrong
    this.printVersions(versions, installed_version, {latest_version: latest})
  }

  //@ts-ignore adding additional metadata for printing
  override printVersions(versions: Array<ReleaseMetadata>, installed_version: string, {latest_version}: PrintOptions): void {
    const output = new Table().padding(8)
    output.header(['VERSION', 'AGE', 'LATEST', 'INSTALLED'])
    const body: RowType[] = []
    for (const version of versions) {
      const installed = semverEqual(parse(version.tag), parse(installed_version ?? '0.0.0'))
      const latest = semverEqual(parse(version.tag), parse(latest_version.tag ?? '0.0.0'))
      body.push([
        version.tag
      , date.age(version.created_at)
      , new Cell(latest ? '*' : '').align('center')
      , new Cell(installed ? '*' : '').align('center')
     ])
    }

    console.log(output.body(body).toString())
  }
}
