import {test, beforeAll, afterAll, afterEach} from 'bun:test'
import {Database} from 'bun:sqlite'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {assertEquals, assertRejects, assertAlmostEquals} from '@std/assert'
import Store, {ENCODING} from './store.ts'

let tmp_dir: string
let db: Database
let store: Store

type StoredRow = {
  type: string
, value: unknown
, encoding: number
, category: string
, expires_at: number | null
}

function stored(key: string): StoredRow | null {
  return db.prepare(`
    SELECT typeof(value) AS type, value, encoding, category, expires_at
    FROM config WHERE key = ?1
  `).get(key) as StoredRow | null
}

beforeAll(() => {
  tmp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mzm-config-store-'))
  db = new Database(path.join(tmp_dir, 'mzm.cfg'), {strict: true})
  store = new Store(db)
})

afterEach(() => {
  db.run('DELETE FROM config')
})

afterAll(() => {
  store.close()
  fs.rmSync(tmp_dir, {recursive: true, force: true})
})

test('store.set - native values', async () => {
  const cases = [{
    value: 'https://api.mezmo.com'
  , type: 'text'
  }, {
    value: ''
  , type: 'text'
  , message: 'empty string'
  }, {
    value: '123'
  , type: 'text'
  , message: 'numeric string stays a string'
  }, {
    value: 'true'
  , type: 'text'
  , message: 'boolean string stays a string'
  }, {
    value: 60000
  , type: 'integer'
  }, {
    value: 0
  , type: 'integer'
  }, {
    value: -42
  , type: 'integer'
  }, {
    value: 1.5
  , type: 'real'
  }, {
    value: null
  , type: 'null'
  }]

  for (const current of cases) {
    const message = current.message ?? `${typeof current.value} ${current.value}`
    await store.set('test.native', current.value)
    assertEquals(await store.getOne('test.native'), current.value, `round trip: ${message}`)

    const row = stored('test.native')
    assertEquals(row?.type, current.type, `sqlite type: ${message}`)
    assertEquals(row?.encoding, ENCODING.NATIVE, `native encoding: ${message}`)
    assertEquals(row?.value, current.value, `stored as is: ${message}`)
  }
})

test('store.set - json values', async () => {
  const cases = [{
    value: true
  , text: 'true'
  }, {
    value: false
  , text: 'false'
  }, {
    value: {query: '_account:*', size: 100, nested: {list: [1, 'two', null, false]}}
  , text: '{"query":"_account:*","size":100,"nested":{"list":[1,"two",null,false]}}'
  }, {
    value: ['a', 2, {b: true}]
  , text: '["a",2,{"b":true}]'
  }, {
    value: {}
  , text: '{}'
  }, {
    value: Object.assign(Object.create(null), {a: 1})
  , expected: {a: 1}
  , text: '{"a":1}'
  , message: 'object without a prototype'
  }]

  for (const current of cases) {
    const message = current.message ?? current.text
    await store.set('test.json', current.value)
    assertEquals(await store.getOne('test.json'), current.expected ?? current.value, `round trip: ${message}`)

    const row = stored('test.json')
    assertEquals(row?.type, 'text', `sqlite type: ${message}`)
    assertEquals(row?.encoding, ENCODING.JSON, `json encoding: ${message}`)
    assertEquals(row?.value, current.text, `stored as json: ${message}`)
  }
})

test('store.set - unsupported values', async () => {
  const circular: Record<string, unknown> = {}
  circular.self = circular

  const cases = [{
    value: undefined
  , expected: 'type undefined at test.unsupported'
  }, {
    value: 10n
  , expected: 'type bigint at test.unsupported'
  }, {
    value: NaN
  , expected: 'type number at test.unsupported'
  }, {
    value: Infinity
  , expected: 'type number at test.unsupported'
  }, {
    value: Symbol('nope')
  , expected: 'type symbol at test.unsupported'
  }, {
    value: () => {}
  , expected: 'type function at test.unsupported'
  }, {
    value: new Date(0)
  , expected: 'type Date at test.unsupported'
  }, {
    value: new Map([['a', 1]])
  , expected: 'type Map at test.unsupported'
  }, {
    value: new Set([1])
  , expected: 'type Set at test.unsupported'
  }, {
    value: new Uint8Array([1, 2])
  , expected: 'type Uint8Array at test.unsupported'
  }, {
    value: {a: {b: undefined}}
  , expected: 'type undefined at test.unsupported.a.b'
  }, {
    value: {list: [1, new Date(0)]}
  , expected: 'type Date at test.unsupported.list[1]'
  }, {
    value: [NaN]
  , expected: 'type number at test.unsupported[0]'
  }, {
    value: circular
  , expected: 'circular reference at test.unsupported.self'
  }]

  await store.set('test.unsupported', 'original')
  for (const current of cases) {
    await assertRejects(async () => {
      await store.set('test.unsupported', current.value as any)
    }, TypeError, current.expected)
  }

  assertEquals(await store.getOne('test.unsupported'), 'original', 'a rejected value leaves the setting as it was')

  // the same object more than once is not a cycle
  const shared = {a: 1}
  await store.set('test.shared', {left: shared, right: shared})
  assertEquals(await store.getOne('test.shared'), {left: {a: 1}, right: {a: 1}}, 'repeated references are stored')
})

test('store.set - replaces the value, encoding and expiry', async () => {
  await store.set('test.replace', {a: 1}, 60000)
  await store.set('test.replace', 'plain')

  const row = stored('test.replace')
  assertEquals(await store.getOne('test.replace'), 'plain', 'value replaced')
  assertEquals(row?.encoding, ENCODING.NATIVE, 'encoding replaced')
  assertEquals(row?.expires_at, null, 'expiry removed')
  assertEquals(db.prepare('SELECT count(*) AS total FROM config').get(), {total: 1}, 'single row for the key')
})

test('store.set - ttl', async () => {
  const before = Date.now()
  await store.set('test.ttl', 'short lived', 60000)
  assertAlmostEquals(stored('test.ttl')?.expires_at as number, before + 60000, 1000, 'expires ttl milliseconds from now')
  assertEquals(await store.getOne('test.ttl'), 'short lived', 'readable before it expires')

  await store.set('test.forever', 'kept', 0)
  assertEquals(stored('test.forever')?.expires_at, null, 'a ttl of 0 never expires')

  await store.set('test.blink', 'gone', 1)
  await Bun.sleep(5)
  assertEquals(await store.getOne('test.blink'), null, 'getOne: expired value reads as missing')
  assertEquals(await store.getMany('test.blink', 'test.ttl'), [null, 'short lived'], 'getMany: expired value reads as missing')
  assertEquals(await store.get('test.blink'), [{
    key: ['test', 'blink']
  , category: 'test'
  , value: null
  }], 'get: expired value reads as missing')
  assertEquals((await store.get('test.*')).map((entry) => {
    return entry.key.join('.')
  }), ['test.forever', 'test.ttl'], 'get wildcard: expired value is not listed')

  assertEquals(stored('test.blink')?.value, 'gone', 'reading does not remove the expired row')
  await store.set('test.other', 1)
  assertEquals(stored('test.blink'), null, 'the next write removes the expired row')
  assertEquals(await store.getOne('test.ttl'), 'short lived', 'rows that have not expired are kept')
})

test('store.get - exact key', async () => {
  await store.set('core.host.api', 'https://api.mezmo.com')

  assertEquals(await store.get('core.host.api'), [{
    key: ['core', 'host', 'api']
  , category: 'core'
  , value: 'https://api.mezmo.com'
  }], 'single entry for the key')

  assertEquals(await store.get('core.host.missing'), [{
    key: ['core', 'host', 'missing']
  , category: 'core'
  , value: null
  }], 'a key that is not set has a null value')

  const keys: Array<string> = []
  for await (const entry of await store.get('core.host.api')) {
    keys.push(entry.key.join('.'))
  }
  assertEquals(keys, ['core.host.api'], 'entries can be read with for await')
})

test('store.get - wildcard', async () => {
  await store.set('search.page.ttl', 60000)
  await store.set('core.host.stream', 'https://tail.mezmo.com')
  await store.set('core.host.api', 'https://api.mezmo.com')
  await store.set('core.log.level', 'ERROR')
  await store.set('core.flag', true)
  await store.set('corex.host.api', 'not core')
  await store.set('Core.host.api', 'not core either')
  await store.set('toplevel', 'no dots')

  function keys(entries: Array<{key: Array<string>}>): Array<string> {
    return entries.map((entry) => {
      return entry.key.join('.')
    })
  }

  const all = await store.get('*')
  assertEquals(keys(all), [
    'Core.host.api'
  , 'core.flag'
  , 'core.host.api'
  , 'core.host.stream'
  , 'core.log.level'
  , 'corex.host.api'
  , 'search.page.ttl'
  , 'toplevel'
  ], 'everything, ordered by category then key')

  assertEquals(all.map((entry) => {
    return entry.category
  }), ['Core', 'core', 'core', 'core', 'core', 'corex', 'search', 'toplevel'], 'category is the first position of the key')

  const core = await store.get('core.*')
  assertEquals(keys(core), [
    'core.flag'
  , 'core.host.api'
  , 'core.host.stream'
  , 'core.log.level'
  ], 'only keys under the prefix')
  assertEquals(core[0], {key: ['core', 'flag'], category: 'core', value: true}, 'values are decoded')

  assertEquals(keys(await store.get('core.host.*')), ['core.host.api', 'core.host.stream'], 'nested prefix')
  assertEquals(await store.get('core.host.api.*'), [], 'the prefix itself is not listed')
  assertEquals(await store.get('nothing.*'), [], 'no matches')

  assertEquals(db.prepare(`
    SELECT category, count(*) AS total FROM config GROUP BY category ORDER BY category
  `).all(), [
    {category: 'Core', total: 1}
  , {category: 'core', total: 4}
  , {category: 'corex', total: 1}
  , {category: 'search', total: 1}
  , {category: 'toplevel', total: 1}
  ], 'category can be grouped on in sql')
})

test('store.getMany', async () => {
  await store.set('search.page.next', 'abc123')
  await store.set('search.page.params', {query: 'error', size: 10})

  assertEquals(await store.getMany('search.page.params', 'search.page.missing', 'search.page.next'), [
    {query: 'error', size: 10}
  , null
  , 'abc123'
  ], 'values in the order requested')
  assertEquals(await store.getMany(), [], 'no keys')
})

test('store.unset', async () => {
  await store.set('upgrade.cleanup.file', '/tmp/mzm.2.0.0')
  await store.unset('upgrade.cleanup.file')
  assertEquals(await store.getOne('upgrade.cleanup.file'), null, 'value removed')
  assertEquals(stored('upgrade.cleanup.file'), null, 'row removed')
  await store.unset('upgrade.cleanup.file')
})

test('store - unknown encoding', async () => {
  await store.set('test.known', 'known')
  db.prepare(`INSERT INTO config(key, value, encoding) VALUES ('test.future', 'from a newer release', 99)`).run()

  assertEquals(await store.getOne('test.future'), null, 'getOne: reads as missing')
  assertEquals(await store.getMany('test.future', 'test.known'), [null, 'known'], 'getMany: reads as missing')
  assertEquals((await store.get('test.*')).map((entry) => {
    return entry.key.join('.')
  }), ['test.known'], 'get wildcard: not listed')
  assertEquals(stored('test.future')?.value, 'from a newer release', 'the row is left alone')
})

test('store - shares a database with an existing config table', async () => {
  await store.set('test.shared', 'value')
  const other = new Store(db)
  assertEquals(await other.getOne('test.shared'), 'value', 'second store reads the same table')
})
