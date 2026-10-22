import {debuglog} from 'node:util'
import type {Database} from 'bun:sqlite'

const log = debuglog('config:denokv')

// Releases built on deno kept settings in Deno.Kv, which stores them in a `kv` table
// in the same sqlite file. Keys use the kv tuple encoding and values are in v8's
// serialization format. This reads the subset of both that the cli ever wrote

export type KvEntry = {
  key: Array<string>
, value: string | number | boolean | null
, expires_at: number | null
}

type KvRow = {
  k: Uint8Array
, v: Uint8Array
, v_encoding: number
, expiration_ms: number
}

const KEY_STRING = 0x02
const KEY_TERMINATOR = 0x00
const KEY_ESCAPE = 0xff

const VALUE_ENCODING_V8 = 1
const NO_EXPIRATION = -1

const V8_HEADER = 0xff
const V8_PADDING = 0x00
const V8_ONE_BYTE_STRING = 0x22 // "
const V8_TWO_BYTE_STRING = 0x63 // c
const V8_UTF8_STRING = 0x53 // S
const V8_INT32 = 0x49 // I
const V8_UINT32 = 0x55 // U
const V8_DOUBLE = 0x4e // N
const V8_TRUE = 0x54 // T
const V8_FALSE = 0x46 // F
const V8_NULL = 0x30 // 0

/**
 * Decodes a Deno.Kv key made up entirely of string parts
 * @returns the key parts, or null if the key holds anything other than strings
 */
export function decodeKey(bytes: Uint8Array): Array<string> | null {
  const parts: Array<string> = []
  let offset = 0

  while (offset < bytes.length) {
    if (bytes[offset++] !== KEY_STRING) return null

    const part: Array<number> = []
    while (true) {
      if (offset >= bytes.length) return null
      const byte = bytes[offset++]
      if (byte === KEY_TERMINATOR) {
        // a zero byte inside of a string is followed by 0xff
        if (bytes[offset] !== KEY_ESCAPE) break
        offset++
      }
      part.push(byte)
    }
    parts.push(Buffer.from(part).toString('utf8'))
  }

  return parts.length ? parts : null
}

/**
 * Decodes a Deno.Kv value holding a single string, number, boolean or null
 * @returns the value, or undefined for anything else (objects, arrays, dates, bigints, bytes)
 */
export function decodeValue(bytes: Uint8Array, encoding: number): string | number | boolean | null | undefined {
  if (encoding !== VALUE_ENCODING_V8) return undefined

  const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 0

  function varint(): number {
    let result = 0
    let shift = 0
    let byte = 0
    do {
      if (offset >= buf.length) return NaN
      byte = buf[offset++]
      result += (byte & 0x7f) * 2 ** shift
      shift += 7
    } while (byte & 0x80)
    return result
  }

  function chars(encoding: BufferEncoding): string | undefined {
    const length = varint()
    if (!(offset + length <= buf.length)) return undefined
    return buf.toString(encoding, offset, offset + length)
  }

  if (buf[offset++] !== V8_HEADER) return undefined
  varint() // format version

  // two byte strings are aligned with padding
  while (buf[offset] === V8_PADDING) offset++

  switch (buf[offset++]) {
    case V8_ONE_BYTE_STRING: return chars('latin1')
    case V8_TWO_BYTE_STRING: return chars('utf16le')
    case V8_UTF8_STRING: return chars('utf8')
    case V8_INT32: {
      const zigzag = varint()
      if (Number.isNaN(zigzag)) return undefined
      return (zigzag >>> 1) ^ -(zigzag & 1)
    }
    case V8_UINT32: {
      const value = varint()
      return Number.isNaN(value) ? undefined : value
    }
    case V8_DOUBLE: {
      if (offset + 8 > buf.length) return undefined
      return buf.readDoubleLE(offset)
    }
    case V8_TRUE: return true
    case V8_FALSE: return false
    case V8_NULL: return null
  }

  return undefined
}

/**
 * Checks for the table Deno.Kv keeps its data in
 */
export function exists(db: Database): boolean {
  return !!db.prepare(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'kv'`).get()
}

/**
 * Reads the settings a deno built release stored with Deno.Kv
 * Rows that have expired, and rows this cannot decode are left out
 * @param db - the sqlite database holding the Deno.Kv tables
 * @param now - the time, in milliseconds, used to decide if a row has expired
 */
export function entries(db: Database, now: number = Date.now()): Array<KvEntry> {
  const rows = db.prepare('SELECT k, v, v_encoding, expiration_ms FROM kv').all() as Array<KvRow>
  const output: Array<KvEntry> = []

  for (const row of rows) {
    const key = decodeKey(row.k)
    if (!key) {
      log('skipping a key that is not made of strings: %o', row.k)
      continue
    }

    const expires = row.expiration_ms !== NO_EXPIRATION
    if (expires && row.expiration_ms <= now) {
      log('skipping expired key: %s', key.join('.'))
      continue
    }

    const value = decodeValue(row.v, row.v_encoding)
    if (value === undefined) {
      log('skipping unsupported value for key: %s', key.join('.'))
      continue
    }

    output.push({key, value, expires_at: expires ? row.expiration_ms : null})
  }

  return output
}
