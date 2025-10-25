import {MZMCommand} from '@mzm/core'
import {set as SetCommand} from './set/mod.ts'
import {get as GetCommand} from './get/mod.ts'

const config = new MZMCommand()
  .name('config')
  .description('Manage the the configuration the mzm command')
  .alias('cfg')
  .action(function () {
    this.showHelp()
  })
  .command('get', GetCommand)
  .command('set', SetCommand)

export {config as ConfigCommand}
