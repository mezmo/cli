import {debuglog} from 'node:util'
import {DatabaseSync} from 'node:sqlite'
import * as os from 'node:os'
import * as path from '@std/path'
import {exists} from '@std/fs/exists'
import {default as Store} from './store.ts'
import {SQL} from './sql.ts'

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

if (!config_exists) {
  log('setting inital value for core.api-host')
  await store.set('core.host.api', 'https://api.mezmo.com')

  log('setting inital value for core.stream-host')
  await store.set('core.host.stream', 'https://tail.mezmo.com')

  log('setting initial value for core.log.level')
  await store.set('core.log.level', 'ERROR')

  log('setting initial value for search.page.ttl')
  await store.set('search.page.ttl', 1000 * 60)

  log('setting inital value for search.page.limit')
  await store.set('search.page.limit', 100)

  db.exec(`
    DROP TABLE IF EXISTS conversation_history;
    DROP TABLE IF EXISTS conversation;
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversation(
      conversation_session_id TEXT PRIMARY KEY
    , created_at INTEGER NOT NULL DEFAULT (unixepoch())
    , active BOOLEAN NOT NULL DEFAULT FALSE
    );
    CREATE TABLE IF NOT EXISTS conversation_history(
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    , conversation_history_id TEXT PRIMARY KEY DEFAULT (LOWER(HEX(RANDOMBLOB(8))))
    , role TEXT NOT NULL
    , content TEXT NOT NULL
    , conversation_session_id TEXT NOT NULL
    , first_message BOOLEAN DEFAULT FALSE
    , FOREIGN KEY (conversation_session_id)
      REFERENCES conversation(conversation_session_id)
      ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX conversation_active_uniq ON conversation(active) WHERE active = 1;
    CREATE INDEX conversation_history_session_id_idx ON conversation_history(conversation_session_id);
    CREATE INDEX conversation_session_id_idx ON conversation(conversation_session_id);
  `)
}

export default store
export {kvdb, sql, db as sqlite}
