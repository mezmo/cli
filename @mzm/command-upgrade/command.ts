import {UpgradeCommand} from '@mzm/core/update'
import {info} from '@mzm/core/release'
import {GithubReleaseProvider} from '@mzm/core/update/providers'

interface GithubReleasesUpgradeOptions {
  provider: GithubReleaseProvider;
}

/**
 * GithubReleasesUpgradeCommand
 * A Cliffy UpgradeCommand for upgrading software using GitHub Releases
 * @param options - An object containing the following properties:
 * - provider: A GithubReleasesProvider instance
 */
export default class GithubReleasesUpgradeCommand extends UpgradeCommand {
  constructor(options: GithubReleasesUpgradeOptions) {
    // @ts-ignore work around for command subclassing
    super(options)
  }

  override getVersion(): string | undefined {
    const release = info()
    return release.version
  }
}
