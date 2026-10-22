import {debuglog} from 'node:util'
import type {Database} from 'bun:sqlite'
import * as denokv from '../../denokv.ts'

const log = debuglog('config:migrate')

// short lived pagination state for `log search --next`. The params are an object,
// which the kv decoder does not read, and the cursor is of no use without them
const TRANSIENT: Set<string> = new Set([
  'search.page.next'
, 'search.page.params'
])

// Copies the settings a deno built release kept in Deno.Kv into the config table.
// The kv tables are left as they are so those releases keep working with this file
export async function up(context: any) {
  const db: Database = context.db as Database
  const store = context.store

  if (!denokv.exists(db)) return log('no deno kv settings to import')

  const now = Date.now()
  for (const entry of denokv.entries(db, now)) {
    const key = entry.key.join('.')
    if (TRANSIENT.has(key)) continue

    log('importing %s', key)
    const ttl = entry.expires_at === null ? undefined : entry.expires_at - now
    await store.set(key, entry.value, ttl)
  }
}

export async function down() {}
