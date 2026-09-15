import type {RequestError} from '@anitrend/request-client'
import {compareSimilarity, levenshteinDistance} from '@std/text'
import {AuthorizationError, CommunicationError, GenericError} from '../../../error.ts'
import client from '../../client.ts'
import {type Account} from './types.ts'
import {type IV3ListResponse, type IV3DetailResponse} from '../types.ts'

export async function list(params?: Record<string, string>): Promise<Array<Account>> {
  try {
    const res  = await client.get('v3/auth/account', params)
    const body: IV3ListResponse<Account> = res.data as IV3ListResponse<Account>
    // the api reports the account the access key belongs to
    const active = res.headers.get('x-auth-account-short-id')
    for (const account of body.data) {
      account.pk = account.account
      account.active = account.account === active
    }
    return body.data as Array<Account>
  } catch (err) {
    if (err instanceof GenericError) throw err
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status

    switch (status) {
      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }
      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read views in the appropriate account'
        , cast?.response?.data
        )
      }
      case 404: {
        return []
      }
      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , cast?.response?.data
        )
      }
    }
  }
}

export async function get(pk: string, params?: Record<string, string>): Promise<Account | null> {
  try {
    const res  = await client.get(`v3/auth/account/${pk}`, params)
    if (res.status === 200) {
      const body: IV3DetailResponse<Account> = res.data as IV3DetailResponse<Account>
      body.data.pk = body.data.account
      body.data.active = body.data.account === res.headers.get('x-auth-account-short-id')
      return body.data as Account
    }
    return null
  } catch (err) {
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status
    if (err instanceof GenericError) throw err
    switch(status) {
      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }
      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read views in the appropriate account'
        , cast?.response?.data
        )
      }
      case 404: {
        // not really an "error"
        return null
      }
      default: {
        throw err
      }
    }
  }
}

/**
 * Finds accounts matching an id or company name. An exact match on the short id, long id,
 * or company name returns only that account. Otherwise accounts with a similar company name
 * are returned, most similar first
 *
 * @param input The account id or company name to look for
 * @param accounts The accounts to search
 * @returns The matching accounts
 */
export function findAccount(input: string, accounts: Array<Account>): Array<Account> {
  const term = input.trim().toLowerCase()
  const exact = accounts.find((account) => {
    return account.account === input
      || account.account_id === input
      || String(account.company ?? '').toLowerCase() === term
  })
  if (exact) return [exact]

  const compact = term.replace(/\s+/g, '')
  const matches = accounts.filter((account) => {
    const name = String(account.company ?? '').toLowerCase()
    if (!name) return false
    return name.includes(term)
      || levenshteinDistance(name.replace(/\s+/g, ''), compact) <= Math.floor(term.length / 2)
  })

  const comparator = compareSimilarity(term)
  return matches.sort((a, b) => {
    return comparator(String(a.company).toLowerCase(), String(b.company).toLowerCase())
  })
}
