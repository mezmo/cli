import {debuglog} from 'node:util'
import {type JSValue, str} from '@mzm/core/lang'
const log = debuglog('config:storage')

export default class Store {
  #kvdb: Deno.Kv
  constructor(kv: Deno.Kv) {
    this.#kvdb = kv
    globalThis.addEventListener('unload', () => {
      this.close()
    })
  }

  async get(key: string) {
    const bits:string[] = key.split('.')
    if (bits[bits.length - 1] != '*') {
      const record = await this.#kvdb.get(bits)
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

    return this.#kvdb.list({prefix: bits})
  }

  async getOne(key: string): Promise<JSValue> {
    const record = await this.#kvdb.get(key.split('.'))
    return record.value as JSValue
  }
  async getMany(...keys: Array<string>) {
    const items = keys.map((item) => {
      return item.split('.')
    })
    const results = await this.#kvdb.getMany(items)
    return results.map((record) => {
      return record.value
    })
  }

  set(key: string, value: JSValue, ttl: number | undefined = undefined): Promise<JSValue> {
    const options = ttl ? {expireIn: ttl} : undefined
    return this.#kvdb.set(key.split('.'), str.typecast(value), options)
  }

  unset(key: string): Promise<void> {
    return this.#kvdb.delete(key.split('.'))
  }

  close() {
    try {
      this.#kvdb.close()
    } catch {
      log('Trouble closing the kvdb instance')
    }
  }
}
