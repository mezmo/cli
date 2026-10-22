import * as fs from 'node:fs/promises'
import {debuglog, format} from 'node:util'
import {CompletionsCommand, MZMCommand, Table, Cell, colors} from '@mzm/core'
import {info} from '@mzm/core/release'
import {LogCommand} from '@mzm/command-log'
import {ConfigCommand} from '@mzm/command-config'
import GetCommand from '@mzm/command-get'
import CreateCommand from '@mzm/command-create'
import DeleteCommand from '@mzm/command-delete'
import EditCommand from '@mzm/command-edit'
import SetCommand from '@mzm/command-set'
import AskCommand from '@mzm/command-ask'
import VersionCommand from '@mzm/command-version'
import {GithubReleasesUpgradeCommand} from '@mzm/command-upgrade'
import {providers} from '@mzm/core/update'
import {logo} from '@mzm/core/assets'
import {storage} from '@mzm/config'

const debug = debuglog('core:command:entry')

const upgrade = new GithubReleasesUpgradeCommand({
  provider: new providers.GithubReleaseProvider({
    spinner: true
  , repository: 'mezmo/cli'
  , asset_map: {
      linux: {
        ['x86_64']: 'mzm-linux-x86_64'
      , ['aarch64']: 'mzm-linux-aarch64'
      }
    , darwin: {
        ['x86_64']: 'mzm-darwin-x86_64'
      , ['aarch64']: 'mzm-darwin-aarch64'
      }
    , windows: {
        ['x86_64']: 'mzm-windows-x86_64.exe'
      , ['aarch64']: null
      }
    }
  })
})
if (import.meta.main) {
  const previous_version: string | null = await storage.getOne('upgrade.cleanup.file') as string | null
  if (previous_version) {
    debug('previous version cleanup: %s', previous_version)
    fs
      .rm(previous_version)
      .catch((error: unknown) => {
        debug('unable to remove previous version', error)
      })
      .finally(() => {
        debug('previous version cleanup complete')
        return storage.unset('upgrade.cleanup.file')
      })
  }

  const cmd = new MZMCommand()
    .globalOption('--account <account:string>', 'Run the command as a specific account (enterprise access keys)')
    .globalEnv(
      'MZM_ACCOUNT_ID=<value:string>'
    , 'Account to run commands as when using an enterprise access key'
    , {prefix: 'MZM_'}
    )
    .globalAction(function (options: {account?: string}) {
      // the flag takes precedence over the environment variable
      if (options.account) process.env.MZM_ACCOUNT_ID = options.account
    })
    .action(function () {
      const output = new Table().padding(8)

      const body = []
      body.push(['', new Cell(logo())])
      body.push([])
      body.push([
        new Cell(
          format('%s %s @ %s', colors.yellow('mezmo'), 'cli', colors.bold(info().version))
        ).colSpan(2).align('center')
      , ''
      ])
      console.log(output.body(body).toString())
      this.showHelp()
    })
    .command('ask', AskCommand)
    .command('completions', new CompletionsCommand())
    .command('config', ConfigCommand)
    .command('create', CreateCommand)
    .command('delete', DeleteCommand)
    .command('edit', EditCommand)
    .command('get', GetCommand)
    .command('log', LogCommand)
    .command('set', SetCommand)
    .command('upgrade', upgrade)
    .command('version', VersionCommand)

  try {
    await cmd.parse(process.argv.slice(2))
  } catch (err: any) {
    debug('%O', err)

    cmd.showHelp()
    if (err.cause?.help) {
      console.error(String(err))
      process.exitCode = err.exit_code ?? 1
    } else {
      throw err
    }
  }
}
