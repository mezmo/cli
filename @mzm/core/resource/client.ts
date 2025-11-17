import {debuglog} from 'node:util'
import {createClient} from '@anitrend/request-client'
import type {RequestConfig} from '@anitrend/request-client'
import {storage} from '@mzm/config'
import {AuthorizationError} from '../error.ts'
import {colors} from '@cliffy/ansi/colors'

const log = debuglog('api:request')

const ACCESS_KEY: string | undefined = Deno.env.get('MZM_ACCESS_KEY') as string ?? ''

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

const aura = createClient({
  baseURL: await storage.getOne('core.host.api') as string
, timeout: 1000 * 60 * 10
, responseType: 'json'
})

// add auth key just before request as to not
// print it when introspecting objects inline
client.interceptors.request.use((config: ApiRequest): RequestConfig => {
  if (!ACCESS_KEY) throw AuthorizationError.from(
    `Make sure the environment variable ${colors.magenta('MZM_ACCESS_KEY')} is set`
  )
  const {headers = {}, method, baseURL, url, params = {}} = config
  config.headers = {
    'Content-Type': 'application/json'
  , 'Authorization': `Token ${ACCESS_KEY}`
  ,  ...headers
  }
  return config as RequestConfig
})

aura.interceptors.request.use((config: ApiRequest): RequestConfig => {
  if (!ACCESS_KEY) throw AuthorizationError.from(
    `Make sure the environment variable ${colors.magenta('MZM_ACCESS_KEY')} is set`
  )
  const {headers = {}, method, baseURL, url, params = {}} = config
  config.headers = {
    'Content-Type': 'application/json'
  , 'Authorization': `Bearer ${ACCESS_KEY}`
  ,  ...headers
  }
  return config as RequestConfig
})

export default client
export {aura}
