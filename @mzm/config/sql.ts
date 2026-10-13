
import type {
  Database
, Statement
, SQLQueryBindings
, Changes
} from 'bun:sqlite'

export type SQLOutputValue = string | number | bigint | boolean | null | Uint8Array
type QueryParams = Array<SQLQueryBindings>

type QueryEngine = {
  query: Statement // prepared statement
, values: (...arg1: QueryParams) => QueryEngine // set value parameters
, run: () => Changes // run a query that doesn't return rows (DML)
, get: (...values: QueryParams) => Record<string, SQLOutputValue> | undefined // get first row
, all: (...values: QueryParams) => Array<Record<string, SQLOutputValue>> // return many rows
}

type StringTemplate = (arg1: TemplateStringsArray, ...arg2: QueryParams) => QueryEngine

export function SQL(db: Database): StringTemplate {
  return function(strings: TemplateStringsArray, ...values: QueryParams): QueryEngine {
    const sql = strings.join('?')
    try {
      const stmt = db.prepare(sql)
      return {
        query: stmt
      , values(...replaced: QueryParams): QueryEngine {
          values = replaced
          return this
        }

      , run(): Changes {
          return stmt.run(...values)
        }

      , get(...vals: QueryParams): Record<string, SQLOutputValue> | undefined {
          const inputs = vals.length ? vals : values
          // bun returns null when there is no matching row
          return (stmt.get(...inputs) as Record<string, SQLOutputValue> | null) ?? undefined
        }

      , all(...vals: QueryParams): Array<Record<string, SQLOutputValue>> {
          const inputs = vals.length ? vals : values
          return stmt.all(...inputs) as Array<Record<string, SQLOutputValue>>
        }
      }
    } catch (err) {
      console.dir({sql, err})
      throw new Error('unable to compile sql statement')
    }
  }
}
