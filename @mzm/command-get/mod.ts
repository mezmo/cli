import {EOL} from 'node:os'
import {MZMCommand} from '@mzm/core'
import {default as ViewCommand} from './view/mod.ts'

export default new MZMCommand()
  .name('get')
  .description([
    'Prints a table of the most important information about the specified resources.'
  ].join(EOL))
  .action(function () {
    this.showHelp()
  })
  .command('view', ViewCommand)

