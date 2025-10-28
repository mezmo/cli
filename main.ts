import {LogCommand} from '@mzm/command-log'
import {ConfigCommand} from '@mzm/command-config'
import {CompletionsCommand, MZMCommand} from '@mzm/core'
import {default as GetCommand} from '@mzm/command-get'

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await new MZMCommand()
    .action(function () {
      this.showHelp()
    })
    .command('completions', new CompletionsCommand())
    .command('log', LogCommand)
    .command('config', ConfigCommand)
    .command('get', GetCommand)
    .parse(Deno.args)
}
