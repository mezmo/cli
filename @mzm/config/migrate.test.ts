import {test, beforeEach, afterEach} from 'bun:test'
import type {Database} from 'bun:sqlite'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {assertEquals} from '@std/assert'
import Store from './store.ts'
import {migrate} from './migrate.ts'
import {connect} from './sql.ts'

// a config database written by deno 2.7.1. see fixture/denokv.gen.js
const FIXTURE = path.join(import.meta.dir, 'fixture', 'denokv.cfg')

let tmp_dir: string
let config_file: string
let db: Database | undefined

function open(): {db: Database, store: Store} {
  db = connect(config_file)
  return {db, store: new Store(db)}
}

function versions(database: Database): {schema: unknown, pragma: unknown} {
  const schema = database.prepare('SELECT version FROM schema_version').all()
  const pragma = database.prepare('PRAGMA user_version').get() as {user_version: number}
  return {schema, pragma: pragma.user_version}
}

function tables(database: Database): Array<string> {
  const rows = database.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`).all()
  return (rows as Array<{name: string}>).map((row) => {
    return row.name
  })
}

async function settings(store: Store): Promise<Record<string, unknown>> {
  const output: Record<string, unknown> = {}
  for (const entry of await store.get('*')) {
    output[entry.key.join('.')] = entry.value
  }
  return output
}

beforeEach(() => {
  tmp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mzm-config-migrate-'))
  config_file = path.join(tmp_dir, 'mzm.cfg')
})

afterEach(() => {
  db?.close()
  db = undefined
  fs.rmSync(tmp_dir, {recursive: true, force: true})
})

test('migrate - new config file', async () => {
  const {db, store} = open()
  await migrate(db, store)

  assertEquals(await settings(store), {
    'core.host.api': 'https://api.mezmo.com'
  , 'core.host.stream': 'https://tail.mezmo.com'
  , 'core.log.level': 'ERROR'
  , 'core.upgrade.timeout': 300000
  , 'search.page.limit': 100
  , 'search.page.ttl': 60000
  }, 'default settings')

  assertEquals(tables(db), [
    'config'
  , 'conversation'
  , 'conversation_history'
  , 'schema_version'
  ], 'tables created')

  assertEquals(versions(db), {
    schema: [{version: 4}]
  , pragma: 3
  }, 'user_version is held at the last version a deno built release understands')
})

test('migrate - config file from a deno built release', async () => {
  fs.copyFileSync(FIXTURE, config_file)
  const {db, store} = open()
  const kv_before = db.prepare('SELECT hex(k) AS k, hex(v) AS v, v_encoding, version, expiration_ms FROM kv ORDER BY k').all()
  assertEquals(db.prepare('PRAGMA user_version').get(), {user_version: 3}, 'fixture starts at version 3')

  await migrate(db, store)

  const imported = await settings(store)
  assertEquals(imported, {
    'core.account.current': 'fixture-account'
  , 'core.host.api': 'https://api.example.com'
  , 'core.host.stream': 'https://tail.mezmo.com'
  , 'core.log.level': 'ERROR'
  , 'core.upgrade.timeout': 300000
  , 'search.page.limit': 100
  , 'search.page.ttl': 60000
  , 'fixture.string.ascii': 'hello world'
  , 'fixture.string.empty': ''
  , 'fixture.string.latin1': 'café'
  , 'fixture.string.wide': '日本語 ✓'
  , 'fixture.string.long': 'x'.repeat(300)
  , 'fixture.string.numeric': '123'
  , 'fixture.number.zero': 0
  , 'fixture.number.negative': -42
  , 'fixture.number.float': 1.5
  , 'fixture.number.uint': 3000000000
  , 'fixture.number.large': 2 ** 40
  , 'fixture.boolean.true': true
  , 'fixture.boolean.false': false
  , 'fixture.null': null
  , 'fixture.expires': 'later'
  , 'fixture.nul\0part': 'escaped'
  }, 'settings imported. pagination state and unsupported values are left behind')

  const expires = db.prepare(`
    SELECT key FROM config WHERE expires_at IS NOT NULL
  `).all()
  assertEquals(expires, [{key: 'fixture.expires'}], 'expiration is carried over')

  const kv_after = db.prepare('SELECT hex(k) AS k, hex(v) AS v, v_encoding, version, expiration_ms FROM kv ORDER BY k').all()
  assertEquals(kv_after, kv_before, 'deno kv data is not modified')

  assertEquals(versions(db), {
    schema: [{version: 4}]
  , pragma: 3
  }, 'user_version is not moved past what a deno built release understands')
})

test('migrate - runs once', async () => {
  fs.copyFileSync(FIXTURE, config_file)

  {
    const {db, store} = open()
    await migrate(db, store)
    await store.set('core.host.api', 'https://api.changed.com')
    await store.unset('core.account.current')
    db.close()
  }

  const {db, store} = open()
  await migrate(db, store)

  assertEquals(await store.getOne('core.host.api'), 'https://api.changed.com', 'changed setting is not replaced by the import')
  assertEquals(await store.getOne('core.account.current'), null, 'removed setting is not imported again')
  assertEquals(versions(db), {
    schema: [{version: 4}]
  , pragma: 3
  }, 'version unchanged')
})

test('migrate - config file from an older deno built release', async () => {
  // release 1.x only ran the first migration
  fs.copyFileSync(FIXTURE, config_file)
  {
    const {db} = open()
    db.run(`
      DROP TABLE conversation_history;
      DROP TABLE conversation;
      DROP TABLE config;
      PRAGMA user_version = 1;
    `)
    db.close()
  }

  const {db, store} = open()
  await migrate(db, store)

  assertEquals(tables(db).includes('conversation_history'), true, 'pending migrations are applied')
  assertEquals(await store.getOne('core.host.api'), 'https://api.example.com', 'imported setting wins over the default')
  assertEquals(await store.getOne('core.upgrade.timeout'), 300000, 'setting present')
  assertEquals(versions(db), {
    schema: [{version: 4}]
  , pragma: 3
  }, 'migrated to the latest version')
})
