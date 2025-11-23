import {CompletionsCommand, MZMCommand} from '@mzm/core'
import {debuglog} from 'node:util'
import {LogCommand} from '@mzm/command-log'
import {ConfigCommand} from '@mzm/command-config'
import GetCommand from '@mzm/command-get'
import CreateCommand from '@mzm/command-create'
import DeleteCommand from '@mzm/command-delete'
import EditCommand from '@mzm/command-edit'
import AskCommand from '@mzm/command-ask'
import VersionCommand from '@mzm/command-version'

const debug = debuglog('core:command:entry')

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const cmd = new MZMCommand()
    .action(function () {
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
