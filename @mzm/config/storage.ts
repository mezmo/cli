import {debuglog} from 'node:util'
import * as os from 'node:os'
import * as path from 'node:path'

const log = debuglog('config:storage')
type StorageValue = number | string | boolean
let needs_init = false

const home = os.homedir()
const config_dir = path.join(home, '.config', 'mezmo')
const config_file = path.join(config_dir, 'mzm.cfg')
try {
  Deno.statSync(config_file)
} catch (err: any) {
  if (err.code !== 'ENOENT') throw err
  log('initializing config dir: %s', config_dir)
  Deno.mkdirSync(config_dir, {recursive: true})
  needs_init = true
}

log('opening configuration store: %s', config_file)
const kvdb = await Deno.openKv(config_file)


globalThis.addEventListener('unload', () => {
  try {
    kvdb.close()
  } catch {}
})

const store = {
  async get(key: string) {
    const bits:string[] = key.split('.')
    if (bits[bits.length - 1] != '*') {
      const record = await kvdb.get(bits)
      return {
        [Symbol.asyncIterator]() {
          let index: number = 0
          const data = [record]
          return {
            next: async () => {
              if (index >= data.length) return {done: true}
              return {value: data[index++], done: false}
            }
          }
        }
      }
    }

    bits.pop()

    return kvdb.list({prefix: bits})
  }

, async getOne(key: string) {
    const record = await kvdb.get(key.split('.'))
    return record.value
  }

, set(key: string, value: StorageValue, ttl: number | undefined = undefined) {
    const options = ttl ? {expireIn: ttl} : undefined
    return kvdb.set(key.split('.'), value, options)
  }
, close() {
    try {
      kvdb.close()
    } catch {}
  }
}

if (needs_init) {
  log('setting inital value for core.api-host')
  await store.set('core.host.api', 'https://api.mezmo.com')

  log('setting inital value for core.stream-host')
  await store.set('core.host.stream', 'https://tail.mezmo.com')

  log('setting inital value for core.search.limit')
  await store.set('core.search.limit', 100)

  log('setting initial value for core.log.level')
  await store.set('core.log.level', 'ERROR')
}

export default store
export {kvdb}
