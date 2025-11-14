import {assertEquals} from '@std/assert'
import {typeOf, toArray} from './mod.ts'

class FooBar {
  get [Symbol.toStringTag]() {
    return 'FooBar'
  }
}

Deno.test({
  name: 'typeOf'
, fn: () => {
    assertEquals(typeof typeOf, 'function', 'typeOf is a function')
    const cases = [
      {
        value: ''
      , expected: 'string'
      }
    , {
        value: new Date().toISOString()
      , expected: 'string'
      }
    , {
        value: new Date()
      , expected: 'date'
      }
    , {
        value: null
      , expected: 'null'
      }
    , {
        value: undefined
      , expected: 'undefined'
      }
    , {
        value: 1.1
      , expected: 'number'
      }
    , {
        value: /\w+/
      , expected: 'regexp'
      }
    , {
        value: new RegExp('\\w+')
      , expected: 'regexp'
      }
    , {
        value: new FooBar()
      , expected: 'foobar'
      }
    , {
        value: new Set()
      , expected: 'set'
      }
    , {
        value: [1, 2]
      , expected: 'array'
      }
    , {
        value: {}
      , expected: 'object'
      }
    , {
        value: true
      , expected: 'boolean'
      }
    , {
        value: () => {}
      , expected: 'function'
      }
    , {
        value: async () => {}
      , expected: 'asyncfunction'
      }
    ]
    for (const current of cases) {
      assertEquals(
        typeOf(current.value)
      , current.expected
      )
    }
  }
})

Deno.test({
  name: 'toArray'
, fn: () => {

    const cases = [
      {value: undefined, expected: [], message: 'toArray(undefined) == []'}
    , {value: null, expected: [], message: 'toArray(null) == []'}
    , {value: 1, expected: [1], message: 'toArray(1) == [1]'}
    , {value: '', expected: [], message: 'toArray(\'\') == []'}
    , {value: 'test', expected: ['test']}
    , {value: '1,2,3', expected: ['1', '2', '3']}
    , {value: '1, 2, 3', expected: ['1', '2', '3']}
    , {value: '1, 2, 3', expected: ['1', ' 2', ' 3'], sep: ','}
    , {value: '1|2|3', expected: ['1', '2', '3'], sep: '|'}
    , {value: [1, 2, 3], expected: [1, 2, 3]}
    , {value: new Set([1, null, 'test']), expected: [1, null, 'test']}
    ]
    for (const current of cases) {
      const args: Array<unknown> = [current.value]
      if (current.sep) {
        args.push(current.sep)
      }

      assertEquals(
        // @ts-ignore the prevention of using a spread is not helpful
        toArray(...args)
      , current.expected
      , current.message || `toArray(${current.value}) == ${current.expected}`
      )
    }

  }
})
