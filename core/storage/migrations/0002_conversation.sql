-- conversation history (used by the `ask` command)
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
