import {createClient} from '@anitrend/request-client'
import type {RequestConfig} from '@anitrend/request-client'
import {storage} from '@mzm/config'

const ACCESS_KEY: string | undefined = Deno.env.get('MZM_ACCESS_KEY') as string ?? ''

const client = createClient({
  baseURL: await storage.getOne('core.host.api') as string
, timeout: 3000
, responseType: 'json'
})

// add auth key just before request as to not
// print it when introspecting objects inline
client.interceptors.request.use((config: RequestConfig): RequestConfig => {
  const headers = config.headers ?? {}
  config.headers = {
    'Content-Type': 'application/json'
  , 'Authorization': `Token ${ACCESS_KEY}`
  ,  ...headers
  }
  return config
})

export default client
