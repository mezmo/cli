// deno-coverage-ignore-file
import {debuglog} from 'node:util'
const log = debuglog('config:migrate')

export async function up(context: any) {
  const store = context.store

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

export async function down() {}
