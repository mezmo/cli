
import {MZMCommand} from "@mzm/core"
import {command as LogTailCommand} from './tail/mod.ts'
import {command as SearchCommand} from './search/mod.ts'

const log = new MZMCommand()
  .name('log')
  .description('Interact with your log data.')
  .action(function () {
    this.showHelp()
  })
  .command('tail', LogTailCommand)
  .command('search', SearchCommand)

export {log as LogCommand}
