import * as sqlite from 'node:sqlite'
import type {DatabaseSync} from 'node:sqlite'
import {assertObjectMatch, assertExists, assertEquals, assertArrayIncludes} from '@std/assert'
import {SQL} from './sql.ts'

let db: DatabaseSync

const TEST_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS sql_test(
    name TEXT
  , category TEXT NULL DEFAULT NULL
  , value
  );
`

Deno.test.beforeAll(() => {
  db = new sqlite.DatabaseSync(':memory:')
  db.exec(TEST_TABLE_SQL)
})

Deno.test.afterEach(() => {
  db.exec('DELETE FROM sql_test;')
})

Deno.test({
  name: 'sql.get - anonymous parameters'
, fn: function() {
    const sql = SQL(db)
    sql`
      INSERT INTO sql_test (name)
      VALUES ('hello'), ('world')
    `.run()

    const name = 'hello'
    const query = sql`SELECT name from sql_test where name = ${name}`

    {
      const record = query.get() // default value
      assertExists(record, '1 record returned')
      assertObjectMatch(record, {name})
    }

    {
      const override = 'world'
      const record = query.get(override) // positional parameters
      assertExists(record, '1record returned')
      assertObjectMatch(record, {name: override})
    }

  }
})

Deno.test({
  name: 'sql.all - named parameters'
,fn: function() {
    const sql = SQL(db)
    sql`
      INSERT INTO sql_test (name)
      VALUES ('goodbye'), ('cruel world')
    `.run()

    const name = 'goodbye'
    const query = sql`SELECT name from sql_test where name = :name`
    let params: Record<string, string> = {name}
    query.values(params)

    {
      const records = query.all() // default value
      assertExists(records, '1 record returned')
      assertArrayIncludes(records, [{name}])
    }

    {
      const override = 'cruel world'
      params = {name: override}
      const records = query.all(params) // positional parameters
      assertEquals(Array.isArray(records), true, 'result array returned')
      assertEquals(records.length, 1, '1 record returned')
      assertArrayIncludes(records, [{name: override}])
    }
  }
})

Deno.test({
  name: 'sql.all - anonymous parameters'
, fn: function() {
    const sql = SQL(db)
    sql`
      INSERT INTO sql_test (name, category)
      VALUES ('hello', 'one'), ('world', 'one'), ('unknown', 'foobar')
    `.run()

    const category = 'one'
    const query = sql`SELECT name from sql_test where category = ${category}`

    {
      const records: Array<Record<string, unknown>> = query.all() // default value
      assertEquals(records.length, 2, '2 record returned')
      assertArrayIncludes(records, [{name: 'hello'}, {name: 'world'}])
    }

    {
      const override: string = 'foobar'
      const records = query.all(override) // positional parameters
      assertEquals(Array.isArray(records), true, 'result array retunred')
      assertArrayIncludes(records, [{name: 'unknown'}])
    }

  }
})

Deno.test({
  name: 'sql.all - named parameters'
,fn: function() {
    const sql = SQL(db)
    sql`
      INSERT INTO sql_test (name, category)
      VALUES ('goodbye', 'two'), ('cruel world', 'two'), ('whizbang', 'widgets')
    `.run()

    const category = 'two'
    const query = sql`SELECT name from sql_test where category = :category`
    let params: Record<string, string> = {category}
    query.values(params)

    {
      const records: Array<Record<string, unknown>> = query.all() // default value
      assertEquals(Array.isArray(records), true, 'result array returned returned')
      assertEquals(records.length, 2, '2 record returned')
      assertArrayIncludes(records, [{name: 'goodbye'}, {name: 'cruel world'}])
    }

    {
      const override = 'widgets'
      params = {category: override}
      const records = query.all(params) // positional parameters
      assertExists(records, 'result array returned returned')
      assertEquals(records.length, 1, '1 record returned')
      assertArrayIncludes(records, [{name: 'whizbang'}])
    }
  }
})
