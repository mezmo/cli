import {debuglog} from 'node:util'
import type {Database} from 'bun:sqlite'
import {Migrate} from '@marianmeres/migrate'
import {parse, type SemVer} from '@std/semver'
import type Store from './store.ts'
import * as migrations from './migration/mod.ts'

const log = debuglog('config:storage')

// Releases built on deno keep the schema version in PRAGMA user_version and fail to start
// when it holds a version they do not have a migration for. The pragma is held at the last
// version those releases know about, and the real version is tracked in schema_version
const LEGACY_VERSION_MAX = 3

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_version(
    id INTEGER PRIMARY KEY CHECK (id = 1)
  , version INTEGER NOT NULL
  )
`

/**
 * Brings the config database up to the latest schema version
 * @param db - the sqlite database to migrate
 * @param store - the settings store backed by the same database
 */
export async function migrate(db: Database, store: Store): Promise<void> {
  db.run(CREATE_TABLE)

  const migrator = new Migrate({
    getActiveVersion: async function getActiveVersion(context: Record<string, unknown>) {
      const database: Database = context.db as Database
      const current = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as {version: number} | null
      // a file last written by a deno built release only has the pragma
      const legacy = database.prepare('PRAGMA user_version').get() as {user_version: number | undefined}
      const major = current?.version ?? legacy.user_version
      if (!major) return
      log('current active version: %d', major)
      return `${major}.0.0`
    }
  , setActiveVersion: async function setActiveVersion(version: string | undefined, context: Record<string, unknown>) {
      if (!version) return
      const parsed: SemVer = parse(version)
      const database: Database = context.db as Database
      log('setting active version %d', parsed.major)
      database.prepare(`
        INSERT INTO schema_version(id, version) VALUES (1, ?1)
        ON CONFLICT(id) DO UPDATE SET version = excluded.version
      `).run(parsed.major)
      database.run(`PRAGMA user_version = ${Math.min(parsed.major, LEGACY_VERSION_MAX)}`)
      return version
    }
  }, {db, store})

  for (const [version, migration] of Object.entries(migrations)) {
    log('adding migration version: %s', version)
    migrator.addVersion(version, migration.up, migration.down)
  }

  await migrator.up('latest')
}
