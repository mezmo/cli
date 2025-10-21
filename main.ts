import {LogCommand} from '@mzm/command-log'
import {CompletionsCommand, MZMCommand} from '@mzm/core'

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await new MZMCommand()
    .name('mzm')
    .action(function () {
      this.showHelp()
    })
    .command('completions', new CompletionsCommand())
    .command('log', LogCommand)
    .parse(Deno.args)
}
