import * as string from './string.ts'
import {assertEquals, assertThrows} from '@std/assert'


Deno.test({
  name: 'string.upper'
, fn: () => {
    assertEquals(typeof string.upper, 'function', 'upper is a function')
    const cases = [{
      value: 'test'
    , expected: 'TEST'
    }, {
      value: 'this Is A test'
    , expected: 'THIS IS A TEST'
    }, {
      value: null
    , expected: ''
    }, {
      value: undefined
    , expected: ''
    }, {
      value: {}
    , expected: '[OBJECT OBJECT]'
    }]

    for (const current of cases) {
      assertEquals(
        string.upper(current.value)
      , current.expected
      , `upper(${current.value}) == ${current.expected}`
      )
    }

    assertThrows(() => {
      string.upper(Object.create(null))
    }, 'string.upper called on non-string value')
  }
})

Deno.test({
  name: 'string.typecast'
, fn: () => {
    assertEquals(typeof string.typecast, 'function', 'typecast is a function')
    assertEquals(string.typecast({x: 1}), {x: 1}, 'non string value')
    const cases = [{
      value: 'foo'
    , expected: 'foo'
    }, {
      value: 'true'
    , expected: true
    }, {
      value: 'false'
    , expected: false
    }, {
      value: true
    , expected: true
    }, {
      value: false
    , expected: false
    }, {
    }, {
      value: '123'
    , expected: 123
    , message: 'integer value'
    }, {
      value: '123.45'
    , expected: 123.45
    , message: 'float value'
    }, {
      value: 'null'
    , expected: null
    , message: 'null string value'
    }, {
      value: null
    , expected: null
    , message: 'null literal value'
    }, {
      value: 'undefined'
    , expected: undefined
    , message: 'undefined string value'
    }, {
      value: undefined
    , expected: undefined
    , message: 'undefined literal value'
    }, {
      value: ''
    , expected: ''
    , message: 'empty string value'
    }, {
      value: Infinity
    , expected: Infinity
    , message: 'Infinity returns input'
    }]

    for (const current of cases) {
      assertEquals(
        string.typecast(current.value)
      , current.expected
      , current.message || `typecast(${current.value}) == ${current.expected}`
      )
    }
  }
})
