import type {RequestError} from '@anitrend/request-client'
import {AuthorizationError, CommunicationError, GenericError} from '../../../error.ts'
import client from '../../client.ts'
import {activeAccount} from '../../auth.ts'
import type {Account} from '../account/types.ts'
import type {Enterprise} from './types.ts'
import type {IV3DetailResponse} from '../types.ts'

function toError(err: unknown): Error {
  if (err instanceof GenericError) return err
  const cast: RequestError = err as RequestError
  switch (cast?.response?.status) {
    case 401: {
      return AuthorizationError.from(
        'There was a problem authenticating the previous operation. Make sure your access key is still valid'
      , cast?.response?.data
      )
    }
    case 403: {
      return AuthorizationError.from(
        'Enterprise operations require an enterprise access key with the appropriate permissions'
      , cast?.response?.data
      )
    }
    default: {
      return CommunicationError.from(
        'Try again in a few minutes. If the problem persists, please contact customer support.'
      , cast?.response?.data
      )
    }
  }
}

/**
 * Fetches the enterprise the current access key belongs to, including its child accounts
 *
 * @returns The enterprise and its child accounts
 */
export async function get(): Promise<Enterprise> {
  try {
    const res = await client.get('v3/enterprise')
    const body: IV3DetailResponse<Enterprise> = res.data as IV3DetailResponse<Enterprise>
    const enterprise = body.data
    const active = await activeAccount()
    enterprise.accounts = enterprise.accounts ?? []
    for (const item of enterprise.accounts) {
      item.pk = item.account ?? item.account_id
      item.active = !!active && (item.account === active || item.account_id === active)
    }
    return enterprise
  } catch (err) {
    throw toError(err)
  }
}

/**
 * Fetches a single child account of the current enterprise
 *
 * @param account_id The identifier of the child account
 * @returns The account, or null if it does not exist
 */
export async function account(account_id: string): Promise<Account | null> {
  try {
    const res = await client.get(`v3/enterprise/account/${encodeURIComponent(account_id)}`)
    const body: IV3DetailResponse<Account> = res.data as IV3DetailResponse<Account>
    const active = await activeAccount()
    body.data.pk = body.data.account ?? body.data.account_id
    body.data.active = !!active && (body.data.account === active || body.data.account_id === active)
    return body.data
  } catch (err) {
    const cast: RequestError = err as RequestError
    if (!(err instanceof GenericError) && cast?.response?.status === 404) return null
    throw toError(err)
  }
}
