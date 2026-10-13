import * as fs from 'node:fs/promises'
import {tmpdir} from 'node:os'
import * as path from 'node:path'
import {debuglog} from 'node:util'
import {storage} from '@mzm/config'
import {date} from '@mzm/core/lang'
import {colors} from '@mzm/core'
import {equals as semverEqual, parse, compare, tryParse, format} from '@std/semver'
import {Table, Cell, type RowType} from '@cliffy/table'
import {ValidationError} from '@cliffy/command'
import {Provider} from '@cliffy/upgrade'
import type {GithubProviderOptions} from '@cliffy/upgrade/provider/github'
import {CommunicationError, GenericError, NotFoundError} from '../../error.ts'
import {os, arch, isCompiled, type OS, type Arch} from '../../platform.ts'
import {download, isExecutable} from '../download.ts'
import {swap} from '../swap.ts'
import {verify} from '../verify.ts'
import {
  createClient
, RequestClient
, type RequestError
, type RequestResponse
} from '@anitrend/request-client'

const debug = debuglog('core:command:upgrade:provider')
const DEFAULT_DOWNLOAD_TIMEOUT = 1000 * 60 * 5

type AssetMap = {
  [OS_NAME in OS]?: {
    [ARCH_NAME in Arch]: string | null
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

function noopComplete(_meta: OnCompleteMetadata, _cb: OnCompleteFinalCallback): void {}
function noopError(_error: Error): void {}

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

  // here to appease the abstract class implementation. not used for anything
  hasRequiredPermissions(): Promise<boolean> {
    return Promise.resolve(true)
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
    const running_bin = await fs.realpath(process.execPath)
    // HACK: The calling parent is a top level function that expectes this to be a string
    // And there is no way to change it
    options.to = to

    debug('%o', {to, from, os, arch})
    if (!isCompiled()) {
      throw GenericError.from('In-Place upgrade is only supported for compiled binaries')
    }

    const os_map = this.asset_map[os as OS]
    if (!os_map) throw GenericError.from(`unsupported os: ${os}`)

    const asset_name = os_map[arch as Arch]
    if (!asset_name) throw GenericError.from(`unsupported architecture [${arch}] on ${os}`)

    try {
      const timeout = parseInt(await storage.getOne('core.upgrade.timeout') as string)
      const tmp_file = path.join(tmpdir(), `mzm-${crypto.randomUUID()}`)
      const normalized_to: string = to.startsWith('v') ? to : `v${to}`
      await download(
        `https://github.com/${this.owner}/${this.repo}/releases/download/${normalized_to}/${asset_name}`
      , tmp_file
      , isNaN(timeout) ? DEFAULT_DOWNLOAD_TIMEOUT : timeout
      )

      // a proxy or sign in page can be served with a successful status.
      // Make sure what arrived is a program before it replaces the one that is running
      if (!await isExecutable(tmp_file)) {
        await Promise.allSettled([fs.rm(tmp_file)])
        throw GenericError.from(
          `There was a problem downloading the ${to} release`
        , 'What was downloaded is not a program that can be run. '
          + `Make sure the release is currently available from ${colors.brightBlue(this.getRepositoryUrl('mzm'))}`
        )
      }

      await fs.chmod(tmp_file, 0o776)

      // remove the current one
      debug('removing %s', running_bin)
      const backup_file = await swap(running_bin, tmp_file, from, async (file: string) => {
        try {
          await verify(file)
        } catch (err) {
          debug('the new version could not be run: %s', (err as Error).message)
          throw GenericError.from(
            `The ${to} release does not run on this machine`
          , `Version ${from} was put back and is still installed. `
            + `Check the requirements of the release at ${colors.brightBlue(this.getRepositoryUrl('mzm'))}`
          , err
          )
        }
      })

      if (backup_file) {
        // the command entry point attempts to remove this file on the next run
        await storage.set('upgrade.cleanup.file', backup_file)
        debug('store previous file location %s', backup_file)
      }
    } catch (err: any) {
      const repository_url = colors.brightBlue(this.getRepositoryUrl('mzm'))
      if (err.name === 'TimeoutError') throw GenericError.from(
        `There was a problem downloading the ${to} release\n`
        + 'Looks like it just took too long. Make sure your internet connection is reasonably fast\n'
        + `Additionally, verify there are no current problems reported on ${colors.yellow('https://status.github.com')}`
      )

      if (err instanceof CommunicationError) {
        if (err.status_code === 404) {
          const error = NotFoundError.from(
            `No matching version for: ${to}`
          , `Use ${colors.yellow('mzm')} upgrade --list-versions for acceptable upgrade targets`
          )

          error.message = `Version ${to} Not Found`
          throw error
        }

        throw GenericError.from(
          `There was a problem downloading the ${to} release`
        , `The download server responded with status ${err.status_code}. `
          + `Verify there are no current problems reported on ${colors.yellow('https://status.github.com')}`
        )
      }

      if (err instanceof GenericError) throw err

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
        return {
          created_at: value.created_at
        , tag: value.tag_name
        , toString(): string {
            return value.tag_name.replace('v', '')
          }
        }
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
