// @ts-nocheck ignore until command sub class types are figured out

import {EOL} from 'node:os'
import {Cell, ResourceCommand, ValidationError, colors, prompts} from '@mzm/core'
import {InputError, NotFoundError} from '@mzm/core/error'
import {kvdb} from '@mzm/config'
import {type Account, default as resource} from '@mzm/core/resource'
import {ACCOUNT_KEY, isEnterpriseKey} from '@mzm/core/resource/auth'

const SHORT_ID_EXP = /^[0-9a-f]{10}$/

function renderFlag(value: boolean | undefined): Cell {
  return new Cell(value === true ? '*' : '').align('center')
}

// accounts selected by id are not looked up, so there may be no name
function renderOptional(value?: string): string {
  return value ?? ''
}

export default new ResourceCommand('account')
  .description([
    'Selects the active account of an enterprise. All other commands run as the active account.'
  , 'Accounts can be selected by id or by company name. Names do not need to be exact. When more'
  , 'than one account matches, you will be prompted to choose one. When nothing is given, you will'
  , 'be prompted to choose from all of the accounts of the enterprise.'
  , 'Requires an enterprise access key. For all other access keys the active account is the account'
  , 'the access key belongs to, and can not be changed.'
  ].join(EOL))
  .apiVersion('v3')
  .pk('account')
  .arguments('[account:string]')
  .usage('[id|name] [options]')
  .column({name: 'ACTIVE', property: 'active', render: renderFlag})
  .column({name: 'NAME', property: 'company', render: renderOptional})
  .column({name: 'ID', property: 'pk'})
  .example('select an account by id', 'mzm set account fad41bbce0')
  .example('select an account by name', 'mzm set account "Acme Inc."')
  .example('names do not need to be exact', 'mzm set account "acme icn"')
  .example('choose from all of the accounts of the enterprise', 'mzm set account')
  .example('run a single command as another account instead', 'mzm get view --account $(mzm get account "Acme Inc." -q)')
  .action(async function(options: any, input?: string) {
    if (!isEnterpriseKey()) throw InputError.from(
      'Switching accounts requires an enterprise access key. The active account is determined by the'
      + ` access key in use. Run ${colors.magenta('mzm get account')} to see it`
    )

    // account ids are lower case. names are matched regardless of case
    const value = input?.trim().toLowerCase()
    const interactive = Deno.stdin.isTerminal() && Deno.stdout.isTerminal()

    if (value === '') throw new ValidationError('An account id or name is required. Run "mzm set account" to choose one')

    if (value === undefined && !interactive) throw InputError.from(
      `An account id is required. Run ${colors.magenta('mzm get account')} to find one,`
      + ` then run ${colors.magenta('mzm set account <id>')}`
    )

    // short ids are stored without a lookup so a problematic account can always be replaced
    const short_id = SHORT_ID_EXP.test(value ?? '')
    const accounts: Array<Account> = short_id
      ? [{account: value}]
      : (await resource.v3.enterprise.get()).accounts

    // without input, all of the accounts are offered
    const matches = short_id || !value ? accounts : resource.v3.account.findAccount(value, accounts)

    if (!matches.length) throw NotFoundError.from(
      `No account matching "${value ?? ''}" was found. Run ${colors.magenta('mzm get account')} to see available accounts`
    )

    if (matches.length > 1 && !interactive) throw InputError.from(
      `More than one account matches "${value}": `
      + matches.map((account: Account) => `${account.company} (${account.pk})`).join(', ')
      + `. Run ${colors.magenta('mzm set account <id>')}`
    )

    const selected: Account = matches.length === 1
      ? matches[0]
      : await prompts.Select.prompt({
          message: value ? 'Select A Similar Account' : 'Select An Account'
        , maxRows: 20
        , search: matches.length > 20
        , options: matches
            .sort((a: Account, b: Account) => String(a.company ?? a.pk).localeCompare(String(b.company ?? b.pk)))
            .map((account: Account) => {
              return {name: `${account.company ?? account.pk} (${account.pk})${account.active ? ' *' : ''}`, value: account}
            })
        })

    const account_id = selected.account ?? selected.account_id
    await kvdb.set(ACCOUNT_KEY, account_id)

    // short ids are saved before they are looked up so a problematic account can
    // always be replaced. The lookup only fills in the details that are displayed
    const account: Account = short_id
      ? await resource.v3.enterprise.account(account_id).catch(() => null) ?? selected
      : selected

    account.pk = account_id
    account.active = true

    if (options.quiet) return console.log(account.pk)
    console.log(this.render(account, options.output))
  })
