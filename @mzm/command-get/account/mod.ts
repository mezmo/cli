// @ts-nocheck ignore until command sub class types are figured out

import {EOL} from 'node:os'
import {toArray} from '@mzm/core/lang'
import {ResourceCommand} from '@mzm/core'
import {type Account, default as resource} from '@mzm/core/resource'

function renderSuspend(value: boolean | undefined): string {
  return value === true ? '*' : ''
}
export default new ResourceCommand('account')
  .description([
    'The account subcommand of GET allows you to view all of the accounts that you'
  , 'have immdiate access to. When access keys issued to a service account, the list'
  , 'of accounts will only include the single account the service account is bound to'
  ].join(EOL))
  .apiVersion('v3')
  .pk('account')
  .arguments('[account-id:string]')
  .usage('[id] [options]')
  .column({name: 'NAME', property: 'company'})
  .column({name: 'OWNER', property: 'owneremail'})
  .column({name: 'TYPE', property: 'plan.type'})
  .column({name: 'STATUS', property: 'status'})
  .column({name: 'SUSPENDED', property: 'meta.suspendIngestion', render: renderSuspend})
  .column({name: 'ID', property: 'pk'})
  .example('see all of your accounts', 'mzm get account')
  .example('see an individual account', 'mzm get account fad41bbce')
  .action(async function(options: any, pk?: string) {
    const to_render: Account | Array<Account> = pk
    ? await resource.v3.account.get(pk)
    : await resource.v3.account.list()

    if (options.quiet) return console.log(
      toArray(to_render).map((item) => {
        return item.pk
      }).join(' ')
    )

    console.log(this.render(to_render, options.output))
  })
