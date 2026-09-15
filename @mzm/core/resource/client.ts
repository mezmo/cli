import {createClient} from '@anitrend/request-client'
import type {RequestConfig} from '@anitrend/request-client'
import {storage} from '@mzm/config'
import {AuthorizationError} from '../error.ts'
import {colors} from '@cliffy/ansi/colors'
import {ACCESS_KEY, DELEGATE_HEADER, delegateAccount} from './auth.ts'

interface ApiRequest extends RequestConfig {
  url?: string
, baseURL?: string
, method?: string
, headers?: Record<string, string>
, params?: Record<string, string | number | boolean>
}

const client = createClient({
  baseURL: await storage.getOne('core.host.api') as string
, timeout: 3000
, responseType: 'json'
})

// add auth key just before request as to not
// print it when introspecting objects inline
client.interceptors.request.use(async (config: ApiRequest): Promise<RequestConfig> => {
  if (!ACCESS_KEY) throw AuthorizationError.from(
    `Make sure the environment variable ${colors.magenta('MZM_ACCESS_KEY')} is set`
  )
  const {headers = {}} = config
  const defaults: Record<string, string> = {
    'Content-Type': 'application/json'
  , 'Authorization': `Token ${ACCESS_KEY}`
  }

  // enterprise keys act on child accounts through delegation.
  // The enterprise api itself is never delegated
  if (!config.url?.replace(/^\/+/, '').startsWith('v3/enterprise')) {
    const account_id = await delegateAccount()
    if (account_id) defaults[DELEGATE_HEADER] = account_id
  }

  config.headers = {
    ...defaults
  , ...headers
  }
  return config as RequestConfig
})

export default client
