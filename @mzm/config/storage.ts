import {debuglog} from 'node:util'
import * as os from 'node:os'
import * as path from '@std/path'
import {exists} from '@std/fs/exists'
import {default as Store} from './store.ts'

const log = debuglog('config:storage')

const home = os.homedir()
const config_dir = path.join(home, '.config', 'mezmo')
const config_file = path.join(config_dir, 'mzm.cfg')
const config_exists = await exists(config_file, {isFile: true})

if (!config_exists) {
  log('initializing config dir: %s', config_dir)
  Deno.mkdirSync(config_dir, {recursive: true})
}

log('opening configuration store: %s', config_file)
const kvdb = await Deno.openKv(config_file)

const store = new Store(kvdb)

if (!config_exists) {
  log('setting inital value for core.api-host')
  await store.set('core.host.api', 'https://api.mezmo.com')

  log('setting inital value for core.stream-host')
  await store.set('core.host.stream', 'https://tail.mezmo.com')

  log('setting initial value for core.log.level')
  await store.set('core.log.level', 'ERROR')

  log('setting initial value for search.page.ttl')
  await store.set('search.page.ttl', 1000 * 60)

  log('setting inital value for search.page.limit')
  await store.set('search.page.limit', 100)

}

export default store
export {kvdb}
