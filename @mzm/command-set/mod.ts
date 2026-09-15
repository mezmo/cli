import {EOL} from 'node:os'
import {MZMCommand} from '@mzm/core'
import AccountCommand from './account/mod.ts'

export default new MZMCommand()
  .name('set')
  .usage('<resource> [name|id]')
  .example(
    'Select the active account:'
  , 'mzm set account fad41bbcef'
  )
  .description([
    'Sets the active value of the specified resource for subsequent commands.'
  ].join(EOL))
  .action(function () {
    this.showHelp()
  })
  .command('account', AccountCommand)
