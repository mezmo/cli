import {debuglog} from 'node:util'
import {DatabaseSync} from 'node:sqlite'
import * as os from 'node:os'
import * as path from '@std/path'
import {exists} from '@std/fs/exists'
import {default as Store} from './store.ts'
import {SQL} from './sql.ts'
import {Migrate} from '@marianmeres/migrate'
import {parse, SemVer} from '@std/semver'
import * as migrations from './migration/mod.ts'

const log = debuglog('config:storage')

const home = os.homedir()
const config_dir = path.join(home, '.config', 'mezmo')
const config_file = path.join(config_dir, 'mzm.cfg')
const config_exists = await exists(config_file, {isFile: true})

if (!config_exists) {
  log('initializing config dir: %s', config_dir)
  Deno.mkdirSync(config_dir, {recursive: true})
}

log('opening configuration store: %s', config_file)

// low level sqlite interface
const db: DatabaseSync = new DatabaseSync(config_file)

// deno high level Key/Value interface for sqlite 
const kvdb = await Deno.openKv(config_file)


// sql tag wrapper + query interace for easier prepared statements
const sql = SQL(db)

// primary configuration settings interace
const store = new Store(kvdb)
const migrator = new Migrate({
  getActiveVersion: async function getActiveVersion(context: Record<string, unknown>) {
    const database: DatabaseSync = context.db as DatabaseSync
    const result = database.prepare('PRAGMA user_version').get() as {user_version: number | undefined}
    const major = result.user_version
    if (!major) return
    log('current active version: %d', major)
    return `${major}.0.0`
  }
, setActiveVersion: async function setActiveVersion(version: string | undefined, context: Record<string, unknown>) {
    if (!version) return
    const parsed:SemVer = parse(version)
    const database: DatabaseSync = context.db as DatabaseSync
    log('setting active version %d', parsed.major)
    database.exec(`PRAGMA user_version = ${parsed.major}`)
    return version
  }
}, {db, store})

for (const [version, migration] of Object.entries(migrations)) {
  log('adding migration version: %s', version)
  migrator.addVersion(version, migration.up, migration.down)
}

await migrator.up('latest')

export default store
export {kvdb, sql, db as sqlite}
