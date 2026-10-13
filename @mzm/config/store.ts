import {debuglog} from 'node:util'
import type {Database, Statement} from 'bun:sqlite'

const log = debuglog('config:storage')

export type JSValue = string | Array<JSValue> | boolean | Date | object | number | null | undefined

/**
 * How the value column of a config row was written.
 * NATIVE values are stored as the matching sqlite type and read back as is.
 * JSON values are stored as json text
 */
export const ENCODING = {
  NATIVE: 0
, JSON: 1
} as const

export type ConfigEntry = {
  key: Array<string>
, category: string
, value: JSValue
}

type Encoded = {
  value: string | number | null
, encoding: number
}

type ConfigRow = Encoded & {
  key: string
, category: string
}

// category is the first position of the key (core.host.api -> core).
// It is generated from the key so the two cannot drift apart
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS config(
    key TEXT PRIMARY KEY
  , category TEXT GENERATED ALWAYS AS (substr(key, 1, instr(key || '.', '.') - 1)) VIRTUAL
  , value
  , encoding INTEGER NOT NULL DEFAULT 0
  , expires_at INTEGER
  )
`

const NOT_EXPIRED = '(expires_at IS NULL OR expires_at > ?2)'

function describe(value: unknown): string {
  if (typeof value !== 'object') return typeof value
  return value?.constructor?.name ?? 'object'
}

function unsupported(value: unknown, location: string): TypeError {
  return new TypeError(`Unable to store a value of type ${describe(value)} at ${location}`)
}

function isPlainObject(value: object): boolean {
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

// json silently drops or rewrites the things it cannot represent (undefined, Date, Map, NaN, ...)
// Reject them up front so a value never reads back as something other than what was stored
function assertSerializable(value: unknown, location: string, seen: Set<object>): void {
  switch (typeof value) {
    case 'string':
    case 'boolean': return
    case 'number': {
      if (Number.isFinite(value)) return
      break
    }
    case 'object': {
      if (value === null) return
      if (seen.has(value)) throw new TypeError(`Unable to store a circular reference at ${location}`)

      if (Array.isArray(value)) {
        seen.add(value)
        value.forEach((item, index) => {
          assertSerializable(item, `${location}[${index}]`, seen)
        })
        seen.delete(value)
        return
      }

      if (isPlainObject(value)) {
        seen.add(value)
        for (const [name, item] of Object.entries(value)) {
          assertSerializable(item, `${location}.${name}`, seen)
        }
        seen.delete(value)
        return
      }
    }
  }

  throw unsupported(value, location)
}

/**
 * Converts a javascript value to the representation stored in the config table
 * @param value - the value to store
 * @param location - the name used to identify the value in error messages
 * @throws {TypeError} when the value cannot be stored without changing it
 */
export function encode(value: unknown, location: string = 'value'): Encoded {
  if (value === null) return {value, encoding: ENCODING.NATIVE}
  if (typeof value === 'string') return {value, encoding: ENCODING.NATIVE}
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw unsupported(value, location)
    return {value, encoding: ENCODING.NATIVE}
  }

  // sqlite has no boolean type. A natively bound boolean reads back as 1 or 0
  assertSerializable(value, location, new Set())
  return {value: JSON.stringify(value), encoding: ENCODING.JSON}
}

/**
 * Converts a stored config row back to a javascript value
 * @returns the value, or undefined when the row was written with an encoding this version does not know
 */
export function decode(row: Encoded): JSValue {
  switch (row.encoding) {
    case ENCODING.NATIVE: return row.value
    case ENCODING.JSON: return JSON.parse(row.value as string)
  }
  return undefined
}

/**
 * Key / Value storage for configuration settings backed by a sqlite table.
 * Keys are dot separated paths (core.host.api)
 */
export default class Store {
  #db: Database
  #select: Statement<ConfigRow>
  #list: Statement<ConfigRow>
  #upsert: Statement
  #prune: Statement
  #delete: Statement
  #write: (key: string, encoded: Encoded, expires_at: number | null, now: number) => void

  constructor(db: Database) {
    this.#db = db
    db.run(CREATE_TABLE)

    this.#select = db.prepare(`
      SELECT key, category, value, encoding FROM config
      WHERE key = ?1 AND ${NOT_EXPIRED}
    `)

    this.#list = db.prepare(`
      SELECT key, category, value, encoding FROM config
      WHERE substr(key, 1, length(?1)) = ?1 AND ${NOT_EXPIRED}
      ORDER BY category, key
    `)

    this.#upsert = db.prepare(`
      INSERT INTO config(key, value, encoding, expires_at) VALUES (?1, ?2, ?3, ?4)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value
      , encoding = excluded.encoding
      , expires_at = excluded.expires_at
    `)

    this.#prune = db.prepare('DELETE FROM config WHERE expires_at <= ?1')
    this.#delete = db.prepare('DELETE FROM config WHERE key = ?1')

    this.#write = db.transaction((key: string, encoded: Encoded, expires_at: number | null, now: number) => {
      this.#prune.run(now)
      this.#upsert.run(key, encoded.value, encoded.encoding, expires_at)
    })
  }

  #read(key: string, now: number): JSValue {
    const row = this.#select.get(key, now)
    if (!row) return null

    const value = decode(row)
    if (value === undefined) {
      log('skipping %s. unknown encoding %d', key, row.encoding)
      return null
    }
    return value
  }

  /**
   * Looks up one or more configuration entries
   * @param key - an exact key (core.host.api), or a key prefix ending in a wildcard (core.*)
   * @returns the matching entries. An exact key that is not set returns a single entry with a null value
   */
  async get(key: string): Promise<Array<ConfigEntry>> {
    const bits: string[] = key.split('.')
    const now = Date.now()

    if (bits[bits.length - 1] !== '*') {
      return [{key: bits, category: bits[0], value: this.#read(key, now)}]
    }

    bits.pop()
    const prefix = bits.length ? `${bits.join('.')}.` : ''
    const entries: Array<ConfigEntry> = []
    for (const row of this.#list.all(prefix, now)) {
      const value = decode(row)
      if (value === undefined) {
        log('skipping %s. unknown encoding %d', row.key, row.encoding)
        continue
      }
      entries.push({key: row.key.split('.'), category: row.category, value})
    }
    return entries
  }

  async getOne(key: string): Promise<JSValue> {
    return this.#read(key, Date.now())
  }

  async getMany(...keys: Array<string>): Promise<Array<any>> {
    const now = Date.now()
    return keys.map((key) => {
      return this.#read(key, now)
    })
  }

  /**
   * Stores a configuration value, replacing any previous value and expiry
   * @param key - the name of the setting
   * @param value - a string, finite number, boolean, null, or a plain object / array of the same
   * @param ttl - number of milliseconds the value should be kept for. Kept until removed when omitted
   * @throws {TypeError} when the value cannot be stored without changing it
   */
  async set(key: string, value: JSValue, ttl: number | undefined = undefined): Promise<void> {
    const encoded = encode(value, key)
    const now = Date.now()
    // expired rows are hidden from every read. They are physically removed here
    // rather than at startup so that reading settings never requires a write
    this.#write(key, encoded, ttl ? now + ttl : null, now)
  }

  async unset(key: string): Promise<void> {
    this.#delete.run(key)
  }

  close() {
    try {
      this.#db.close()
    } catch {
      log('Trouble closing the config database')
    }
  }
}
