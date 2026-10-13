import {debuglog} from 'node:util'
import {Database} from 'bun:sqlite'
import * as os from 'node:os'
import * as fs from 'node:fs'
import * as path from 'node:path'
import Store from './store.ts'
import {SQL} from './sql.ts'
import {migrate} from './migrate.ts'

const log = debuglog('config:storage')

const home = os.homedir()
const config_dir = path.join(home, '.config', 'mezmo')
const config_file = path.join(config_dir, 'mzm.cfg')

if (!fs.existsSync(config_file)) {
  log('initializing config dir: %s', config_dir)
  fs.mkdirSync(config_dir, {recursive: true})
}

log('opening configuration store: %s', config_file)

// low level sqlite interface
// strict allows named parameters to be passed with out a prefix - {name: 'value'}
const db: Database = new Database(config_file, {strict: true})

// sql tag wrapper + query interace for easier prepared statements
const sql = SQL(db)

// primary configuration settings interace
const store = new Store(db)

await migrate(db, store)

process.on('exit', () => {
  store.close()
})

export default store
export {sql, db as sqlite}
