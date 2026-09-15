// @ts-nocheck ignore until command sub class types are figured out

import {EOL} from 'node:os'
import {Cell, ResourceCommand} from '@mzm/core'
import {NotFoundError} from '@mzm/core/error'
import {isEnterpriseKey} from '@mzm/core/resource/auth'
import {type Account, default as resource} from '@mzm/core/resource'

function renderFlag(value: boolean | undefined): Cell {
  return new Cell(value === true ? '*' : '').align('center')
}

export default new ResourceCommand('account')
  .description([
    'The account subcommand of GET allows you to view all of the accounts that you'
  , 'have immdiate access to. When access keys issued to a service account, the list'
  , 'of accounts will only include the single account the service account is bound to.'
  , 'When using an enterprise access key, the list includes all of the child accounts'
  , 'of the enterprise. The active account is marked in the ACTIVE column. For enterprise'
  , 'access keys, the active account is the selected account. Otherwise it is the account'
  , 'the access key belongs to'
  ].join(EOL))
  .apiVersion('v3')
  .pk('account')
  .arguments('[account-id:string]')
  .usage('[id] [options]')
  .column({name: 'ACTIVE', property: 'active', render: renderFlag})
  .column({name: 'NAME', property: 'company'})
  .column({name: 'OWNER', property: 'owneremail'})
  .column({name: 'PLAN', property: 'plan.type'})
  .column({name: 'STATUS', property: 'status'})
  .column({name: 'SUSPENDED', property: 'meta.suspendIngestion', render: renderFlag})
  .column({name: 'ID', property: 'pk'})
  .example('see all of your accounts', 'mzm get account')
  .example('see an individual account', 'mzm get account fad41bbcef')
  .example('select the active account (enterprise access keys)', 'mzm set account fad41bbcef')
  .action(async function(options: any, pk?: string) {
    const accounts: Array<Account> = isEnterpriseKey()
      ? (await resource.v3.enterprise.get()).accounts
      : await resource.v3.account.list()

    // an id or name narrows the list to the matching accounts
    const matches = pk ? resource.v3.account.findAccount(pk, accounts) : accounts

    if (!matches.length) throw NotFoundError.from(
      `Unable to find account ${pk}. Run "mzm get account" to see available accounts`
    )

    if (options.quiet) return console.log(matches.map((account: Account) => account.pk).join(' '))
    console.log(this.render(pk && matches.length === 1 ? matches[0] : matches, options.output))
  })
