
// deno-coverage-ignore-file

import {debuglog} from 'node:util'
const log = debuglog('config:migrate')

export async function up(context: any) {
  const store = context.store

  log('setting initial value for core.upgrade.timeout')
  await store.set('core.upgrade.timeout', 1000 * 60 * 5)
}

export async function down(_: any) {}
