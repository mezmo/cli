import {EOL} from 'node:os'
import {MZMCommand} from '@mzm/core'
import ViewCommand from './view/mod.ts'
import ConversationCommand from './conversation/mod.ts'
import AccountCommand from './account/mod.ts'

export default new MZMCommand()
  .name('get')
  .usage('<resource> [name|id]')
  .example(
    'List all views:'
  , 'mzm get view'
  )
  .example(
    'Get a specific view by id:'
  , 'mzm get view 3f4bca174'
  )
  .description([
    'Prints a table of the most important information about the specified resources.'
  ].join(EOL))
  .action(function () {
    this.showHelp()
  })
  .command('account', AccountCommand)
  .command('conversation', ConversationCommand)
  .command('view', ViewCommand)
