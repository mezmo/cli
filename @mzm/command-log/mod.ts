
import {MZMCommand} from "@mzm/core"
import {command as LogTailCommand} from './tail/mod.ts'

const log = new MZMCommand()
  .name('log')
  .description('Interact with your log data.')
  .action(function () {
    this.showHelp()
  })
  .command('tail', LogTailCommand)

export {log as LogCommand}
