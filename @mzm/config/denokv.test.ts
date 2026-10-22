import {test, beforeAll, afterAll} from 'bun:test'
import {Database} from 'bun:sqlite'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {assertEquals, assert} from '@std/assert'
import * as denokv from './denokv.ts'

// a config database written by deno 2.7.1. see fixture/denokv.gen.js
const FIXTURE = path.join(import.meta.dir, 'fixture', 'denokv.cfg')

let tmp_dir: string
let db: Database

beforeAll(() => {
  // sqlite writes -wal and -shm files next to the database. keep them out of the repo
  tmp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mzm-config-denokv-'))
  const config_file = path.join(tmp_dir, 'mzm.cfg')
  fs.copyFileSync(FIXTURE, config_file)
  db = new Database(config_file, {strict: true})
})

afterAll(() => {
  db.close()
  fs.rmSync(tmp_dir, {recursive: true, force: true})
})

function toRecord(entries: Array<denokv.KvEntry>): Record<string, unknown> {
  const output: Record<string, unknown> = {}
  for (const entry of entries) {
    output[entry.key.join('.')] = entry.value
  }
  return output
}

test('denokv.exists', () => {
  assertEquals(denokv.exists(db), true, 'database written by deno')

  const empty = new Database(':memory:')
  assertEquals(denokv.exists(empty), false, 'database with out kv tables')
  empty.close()
})

test('denokv.entries - values', () => {
  assertEquals(toRecord(denokv.entries(db)), {
    'core.account.current': 'fixture-account'
  , 'core.host.api': 'https://api.example.com'
  , 'core.host.stream': 'https://tail.mezmo.com'
  , 'core.log.level': 'ERROR'
  , 'core.upgrade.timeout': 300000
  , 'search.page.limit': 100
  , 'search.page.ttl': 60000
  , 'search.page.next': 'fixture-pagination-id'
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
  }, 'strings, numbers, booleans and null are decoded. everything else is left out')
})

test('denokv.entries - keys', () => {
  const entries = denokv.entries(db)
  const api = entries.find((entry) => {
    return entry.key.join('.') === 'core.host.api'
  })
  assertEquals(api, {
    key: ['core', 'host', 'api']
  , value: 'https://api.example.com'
  , expires_at: null
  }, 'key is split into its parts')

  const escaped = entries.find((entry) => {
    return entry.value === 'escaped'
  })
  assertEquals(escaped?.key, ['fixture', 'nul\0part'], 'escaped zero byte in a key part')

  for (const entry of entries) {
    assert(entry.key.every((part) => {
      return typeof part === 'string'
    }), `${entry.key.join('.')} only has string parts`)
  }
})

test('denokv.entries - expiration', () => {
  const total = denokv.entries(db).length
  const expiring = denokv.entries(db).filter((entry) => {
    return entry.expires_at !== null
  })

  assertEquals(expiring.map((entry) => {
    return entry.key.join('.')
  }).sort(), ['fixture.expires', 'search.page.next'], 'entries with an expiration')

  for (const entry of expiring) {
    assert(entry.expires_at as number > Date.now(), `${entry.key.join('.')} expires in the future`)
  }

  const later = denokv.entries(db, Number.MAX_SAFE_INTEGER)
  assertEquals(later.length, total - expiring.length, 'expired entries are left out')
  assertEquals(toRecord(later)['fixture.expires'], undefined, 'expired entry is not returned')
  assertEquals(toRecord(later)['core.host.api'], 'https://api.example.com', 'entries with no expiration are kept')
})

test('denokv.decodeKey', () => {
  const cases = [{
    bytes: [0x02, 0x61, 0x00]
  , expected: ['a']
  , message: 'single part'
  }, {
    bytes: [0x02, 0x61, 0x00, 0x02, 0x62, 0x63, 0x00]
  , expected: ['a', 'bc']
  , message: 'multiple parts'
  }, {
    bytes: [0x02, 0x00, 0x02, 0x61, 0x00]
  , expected: ['', 'a']
  , message: 'empty part'
  }, {
    bytes: [0x02, 0xc3, 0xa9, 0x00]
  , expected: ['é']
  , message: 'utf8 part'
  }, {
    bytes: []
  , expected: null
  , message: 'empty key'
  }, {
    bytes: [0x02, 0x61]
  , expected: null
  , message: 'part with out a terminator'
  }, {
    bytes: [0x01, 0x61, 0x00]
  , expected: null
  , message: 'bytes part'
  }, {
    bytes: [0x02, 0x61, 0x00, 0x27]
  , expected: null
  , message: 'boolean part'
  }]

  for (const current of cases) {
    assertEquals(denokv.decodeKey(Uint8Array.from(current.bytes)), current.expected, current.message)
  }
})

test('denokv.decodeValue', () => {
  const V8 = 1
  const cases = [{
    bytes: [0xff, 0x0f, 0x53, 0x02, 0xc3, 0xa9]
  , expected: 'é'
  , message: 'utf8 string'
  }, {
    bytes: [0xff, 0x0f, 0x00, 0x63, 0x02, 0x61, 0x00]
  , expected: 'a'
  , message: 'two byte string after padding'
  }, {
    bytes: [0xff, 0x0f, 0x55, 0x80, 0xbc, 0xc1, 0x96, 0x0b]
  , expected: 3000000000
  , message: 'uint32'
  }, {
    bytes: [0xff, 0x0f, 0x49, 0xff, 0xff, 0xff, 0xff, 0x0f]
  , expected: -2147483648
  , message: 'smallest int32'
  }, {
    bytes: [0xff, 0x0f, 0x49, 0xfe, 0xff, 0xff, 0xff, 0x0f]
  , expected: 2147483647
  , message: 'largest int32'
  }, {
    bytes: [0xff, 0x0f, 0x22, 0x05, 0x61]
  , expected: undefined
  , message: 'string shorter than its length'
  }, {
    bytes: [0xff, 0x0f, 0x4e, 0x00, 0x00]
  , expected: undefined
  , message: 'truncated double'
  }, {
    bytes: [0xff, 0x0f, 0x49]
  , expected: undefined
  , message: 'truncated int32'
  }, {
    bytes: [0xff, 0x0f, 0x55]
  , expected: undefined
  , message: 'truncated uint32'
  }, {
    bytes: [0x22, 0x01, 0x61]
  , expected: undefined
  , message: 'missing header'
  }, {
    bytes: []
  , expected: undefined
  , message: 'no data'
  }]

  for (const current of cases) {
    assertEquals(denokv.decodeValue(Uint8Array.from(current.bytes), V8), current.expected, current.message)
  }

  assertEquals(denokv.decodeValue(Uint8Array.from([0xff, 0x0f, 0x54]), 2), undefined, 'encoding other than v8')
})
