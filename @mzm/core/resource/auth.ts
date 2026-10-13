/**
 * Access key inspection and account delegation for enterprise access keys
 *
 * @module
 */
import {colors} from '@cliffy/ansi/colors'
import {storage} from '@mzm/config'
import {AuthorizationError, InputError} from '../error.ts'

/** Header used by enterprise access keys to route a request as a specific child account */
export const DELEGATE_HEADER: string = 'x-delegate-account-id'

/** Config key of the active enterprise account */
export const ACCOUNT_KEY: string = 'core.account.current'

/** The access key provided by the environment */
export const ACCESS_KEY: string = process.env.MZM_ACCESS_KEY ?? ''

/**
 * Indicates if an access key is an enterprise access key
 *
 * @param key The access key to inspect. Defaults to `MZM_ACCESS_KEY`
 */
export function isEnterpriseKey(key: string = ACCESS_KEY): boolean {
  return key.startsWith('ste_')
}

/**
 * Returns the active account of an enterprise: `--account` / `MZM_ACCOUNT_ID`, then `mzm set account`
 */
export async function activeAccount(): Promise<string | null> {
  const override = process.env.MZM_ACCOUNT_ID
  if (override) return override
  // an id made up of digits comes back as a number when it was stored with `mzm config set`
  const value = await storage.getOne(ACCOUNT_KEY)
  return value ? String(value) : null
}

/**
 * Returns the account requests should be delegated to. Only enterprise access keys are delegated
 */
export async function delegateAccount(): Promise<string | null> {
  if (!isEnterpriseKey()) {
    if (process.env.MZM_ACCOUNT_ID) throw InputError.from(
      `${colors.magenta('--account')} and ${colors.magenta('MZM_ACCOUNT_ID')} can only be used with an enterprise`
      + ' access key. The active account is determined by the access key in use'
    )
    return null
  }

  const account_id = await activeAccount()
  if (account_id) return account_id

  throw AuthorizationError.from([
    'An enterprise access key requires an active account.'
  , `Run ${colors.magenta('mzm get account')} to find one and ${colors.magenta('mzm set account <id>')},`
  , `or run ${colors.magenta('mzm set account')} to choose one.`
  , `A single command can use ${colors.magenta('--account <id>')}`
  ].join(' '))
}
