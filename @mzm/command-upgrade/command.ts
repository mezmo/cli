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
    // cliffy routes compiled binaries to its own asset installer and skips provider.upgrade().
    // standalone: false keeps the upgrade going through GithubReleaseProvider.upgrade()
    // @ts-ignore work around for command subclassing
    super({...options, standalone: false})
  }

  override getVersion(): string | undefined {
    const release = info()
    return release.version
  }
}
