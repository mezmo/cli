import {LogCommand} from '@mzm/command-log'
import {ConfigCommand} from '@mzm/command-config'
import {CompletionsCommand, MZMCommand} from '@mzm/core'

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await new MZMCommand()
    .name('mzm')
    .env(
      'MZM_ACCESS_KEY=<value:string>',
      'Mezmo Platform IAM Access Key',
      {prefix: 'MZM_', global: true},
    )
    .action(function () {
      this.showHelp()
    })
    .command('completions', new CompletionsCommand())
    .command('log', LogCommand)
    .command('config', ConfigCommand)
    .parse(Deno.args)
}
