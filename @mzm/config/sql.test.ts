import {test, beforeAll, afterEach} from 'bun:test'
import type {Database} from 'bun:sqlite'
import {assertObjectMatch, assertExists, assertEquals, assertArrayIncludes, assertThrows} from '@std/assert'
import {SQL, connect} from './sql.ts'

let db: Database

const TEST_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS sql_test(
    name TEXT
  , category TEXT NULL DEFAULT NULL
  , value
  );
`

beforeAll(() => {
  db = connect(':memory:')
  db.exec(TEST_TABLE_SQL)
})

afterEach(() => {
  db.exec('DELETE FROM sql_test;')
})

test('sql.get - anonymous parameters', () => {
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

})

test('sql.all - named parameters', () => {
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
})

test('sql.all - anonymous parameters', () => {
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

})

test('sql.all - named parameters', () => {
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
})

test('sql.connect - foreign keys are enforced', () => {
  const connection = connect(':memory:')
  const sql = SQL(connection)
  connection.exec(`
    CREATE TABLE parent(id TEXT PRIMARY KEY);
    CREATE TABLE child(
      id TEXT PRIMARY KEY
    , parent_id TEXT NOT NULL
    , FOREIGN KEY (parent_id) REFERENCES parent(id) ON DELETE CASCADE
    );
    INSERT INTO parent(id) VALUES ('a'), ('b');
    INSERT INTO child(id, parent_id) VALUES ('a1', 'a'), ('a2', 'a'), ('b1', 'b');
  `)

  assertEquals(connection.prepare('PRAGMA foreign_keys').get(), {foreign_keys: 1}, 'enabled for the connection')

  assertThrows(() => {
    sql`INSERT INTO child(id, parent_id) VALUES ('c1', 'c')`.run()
  }, Error, 'FOREIGN KEY constraint failed')

  sql`DELETE FROM parent WHERE id = ${'a'}`.run()
  assertEquals(sql`SELECT id FROM child`.all(), [{id: 'b1'}], 'rows that reference a removed row are removed with it')

  assertEquals(sql`SELECT ${'named'} AS value`.get(), {value: 'named'}, 'statements are usable')
  assertEquals(
    connection.prepare('SELECT :name AS value').get({name: 'no prefix'})
  , {value: 'no prefix'}
  , 'named parameters do not need a prefix'
  )
  connection.close()
})
