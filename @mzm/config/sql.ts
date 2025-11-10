
import type {
  DatabaseSync
, StatementSync
, SQLOutputValue
, SQLInputValue
, StatementResultingChanges
} from 'node:sqlite'

type QueryParams = Array<SQLInputValue> | Array<Record<string, SQLInputValue>>

type QueryEngine = {
  query: StatementSync // prepared statement
, values: (...arg1: QueryParams) => QueryEngine // set value parameters
, run: () => StatementResultingChanges // run a query that doesn't return rows (DML)
, get: (...values: QueryParams) => Record<string, SQLOutputValue> | undefined // get first row
, all: (...values: QueryParams) => Array<Record<string, SQLOutputValue>> // return many rows
}

type StringTemplate = (arg1: TemplateStringsArray, ...arg2: Array<SQLInputValue>) => QueryEngine

export function SQL(db: DatabaseSync): StringTemplate {
  return function(strings: TemplateStringsArray, ...values: QueryParams): QueryEngine {
    const sql = strings.join('?')
    const stmt = db.prepare(sql)
    return {
      query: stmt
    , values(...replaced: QueryParams): QueryEngine {
        values = replaced
        return this
      }

    , run(): StatementResultingChanges {
        //@ts-ignore ignore polymorphic warnings
        return stmt.run(...values)
      }

    , get(...vals: QueryParams): Record<string, SQLOutputValue> | undefined {
        //@ts-ignore ignore polymorphic warnings
        const inputs = vals.length ? vals : values
        //@ts-ignore ignore polymorphic warnings
        return stmt.get(...inputs)
      }

    , all(...vals: QueryParams): Array<Record<string, SQLOutputValue>> {
        //@ts-ignore ignore polymorphic warnings
        const inputs = vals.length ? vals : values
        //@ts-ignore ignore polymorphic warnings
        return stmt.all(...inputs)
      }
    }
  }
}
