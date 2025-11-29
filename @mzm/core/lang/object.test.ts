import * as object from './object.ts'
import {assertEquals, assertThrows} from '@std/assert'

Deno.test('Exports as expected', () => {
  const entries = Object.entries(object)
  assertEquals(entries.length, 1, 'function count')
  assertEquals(typeof object.get, 'function', 'get function exported')
})

Deno.test({
  name: 'object.get'
, fn: () => {
    const input = {
      l1: {
        l1p1: 2
      , l1p2: {
          l3p1: 4
        , l3p2: null
        }
      }
    }


    assertEquals(object.get(undefined, 'l1'), undefined, 'object being undefined')
    assertEquals(object.get(null, 'l1'), undefined, 'object being null')
    assertEquals(object.get(input), undefined, 'default string')
    assertEquals(object.get(input, 'l1.l1p2.l3p1'), 4, 'default separator')
    assertEquals(object.get(input, 'l1-l1p2-l3p1', '-'), 4, 'custom separator')
    assertEquals(object.get(input, 'l1.l1p2.l3p2.l4p1'), null, 'props beyond null values')
    assertEquals(object.get(input, 'l1.l1p2.nope'), undefined, 'no match')
    assertThrows(() => {
      //@ts-ignore test case for type mis match
      object.get(input, 0)
    }, 'property must be a string')

    assertThrows(() => {
      //@ts-ignore test case for type mis match
      object.get(input, 'l1.l1p2.l3p2', 2)
    }, 'property must be a string')
  }
})

