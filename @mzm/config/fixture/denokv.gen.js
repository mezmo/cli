// Generates fixture/denokv.cfg - a config database as a deno built release of mzm leaves it.
// The file is committed. Only run this again if the fixture needs to change.
//
//   deno run --allow-read --allow-write --unstable-kv fixture/denokv.gen.js
//
// Written against deno 2.7.1. It is plain javascript so it stays out of the bun type check
import {DatabaseSync} from 'node:sqlite'

const file = new URL('./denokv.cfg', import.meta.url).pathname
for (const suffix of ['', '-wal', '-shm']) {
  await Deno.remove(`${file}${suffix}`).catch(() => {})
}

const db = new DatabaseSync(file)
const kv = await Deno.openKv(file)
const TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10

function set(key, value, options) {
  return kv.set(key.split('.'), value, options)
}

// migration 1.0.0
await set('core.host.api', 'https://api.mezmo.com')
await set('core.host.stream', 'https://tail.mezmo.com')
await set('core.log.level', 'ERROR')
await set('search.page.ttl', 1000 * 60)
await set('search.page.limit', 100)

// migration 2.0.0
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

// migration 3.0.0
await set('core.upgrade.timeout', 1000 * 60 * 5)
db.exec('PRAGMA user_version = 3')

// settings changed by the user
await set('core.host.api', 'https://api.example.com')
await set('core.account.current', 'fixture-account')

// state left behind by `mzm log search`
await set('search.page.next', 'fixture-pagination-id', {expireIn: TEN_YEARS})
await set('search.page.params', {query: '_account:*', prefer: 'tail', size: 100}, {expireIn: TEN_YEARS})

// values the import reads
await set('fixture.string.ascii', 'hello world')
await set('fixture.string.empty', '')
await set('fixture.string.latin1', 'café')
await set('fixture.string.wide', '日本語 ✓')
await set('fixture.string.long', 'x'.repeat(300))
await set('fixture.string.numeric', '123')
await set('fixture.number.zero', 0)
await set('fixture.number.negative', -42)
await set('fixture.number.float', 1.5)
await set('fixture.number.uint', 3000000000)
await set('fixture.number.large', 2 ** 40)
await set('fixture.boolean.true', true)
await set('fixture.boolean.false', false)
await set('fixture.null', null)
await set('fixture.expires', 'later', {expireIn: TEN_YEARS})
await kv.set(['fixture', 'nul\0part'], 'escaped')

// values the import leaves behind
await set('fixture.skip.object', {a: 1})
await set('fixture.skip.array', [1, 2])
await set('fixture.skip.date', new Date(0))
await set('fixture.skip.bigint', 10n)
await set('fixture.skip.undefined', undefined)
await set('fixture.skip.u64', new Deno.KvU64(5n))
await set('fixture.skip.bytes', new Uint8Array([1, 2, 3]))
await kv.set(['fixture', 'skip', 1], 'numeric key part')

kv.close()

// fold the write ahead log into the main file so the fixture is a single file
db.exec('PRAGMA wal_checkpoint(TRUNCATE)')
db.close()
