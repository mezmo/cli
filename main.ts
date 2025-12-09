import {debuglog, format} from 'node:util'
import {CompletionsCommand, MZMCommand, Table, Cell, colors} from '@mzm/core'
import {info} from '@mzm/core/release'
import {LogCommand} from '@mzm/command-log'
import {ConfigCommand} from '@mzm/command-config'
import GetCommand from '@mzm/command-get'
import CreateCommand from '@mzm/command-create'
import DeleteCommand from '@mzm/command-delete'
import EditCommand from '@mzm/command-edit'
import AskCommand from '@mzm/command-ask'
import VersionCommand from '@mzm/command-version'
import {GithubReleasesUpgradeCommand} from '@mzm/command-upgrade'
import {providers} from '@mzm/core/update'
import {logo} from '@mzm/core/assets'

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
        ['x86_64']: 'mzm-windows-x86_64'
      , ['aarch64']: null
      }
    }
  })
})

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const cmd = new MZMCommand()
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
    .command('upgrade', upgrade)
    .command('version', VersionCommand)

  try {
    await cmd.parse(Deno.args)
  } catch (err: any) {
    if (debug.enabled) console.dir(err)

    cmd.showHelp()
    if (err.cause?.help) {
      console.error(String(err))
      Deno.exitCode = err.exit_code ?? 1
    } else {
      throw err
    }
  }
}
