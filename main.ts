import {LogCommand} from '@mzm/command-log'
import {ConfigCommand} from '@mzm/command-config'
import {CompletionsCommand, MZMCommand} from '@mzm/core'
import {default as GetCommand} from '@mzm/command-get'
import {default as CreateCommand} from '@mzm/command-create'
import {default as DeleteCommand} from '@mzm/command-delete'
import {default as EditCommand} from '@mzm/command-edit'
import {default as AskCommand} from '@mzm/command-ask'

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await new MZMCommand()
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
    .parse(Deno.args)
}
