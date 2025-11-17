import {debuglog} from 'node:util'
import type {RequestError} from '@anitrend/request-client'
import {sql, sqlite} from '@mzm/config'
import {aura as client} from '../../client.ts'
import type {ChatResponse, ChatHistory, Conversation} from './types.ts'
import {ChatRole} from './types.ts'

const debug = debuglog('core:resource:conversation')
const deactivate_current = sql`UPDATE conversation SET active = FALSE WHERE active = TRUE`

export async function create(user_question: string): Promise<ChatResponse> {
  try {
    const ask_time = Date.now()
    const params = {messages: [{content: user_question, role: ChatRole.USER}], metadata: {}}

    debug('starting a new conversation')
    const response = await client.post('v1/chat/completions', params)
    const bot_response: ChatResponse = response.data as ChatResponse
    const chat_session_id: string | undefined = bot_response?.metadata?.chat_session_id
    const response_content: string | undefined = bot_response?.choices?.[0].message.content

    debug('chat session inititated: %s', chat_session_id)
    deactivate_current.run()
    sql`INSERT INTO conversation(conversation_session_id, active) VALUES (${chat_session_id}, TRUE)`.run()

    sql`
    INSERT INTO conversation_history (created_at, conversation_session_id, first_message, content, role)
    VALUES
      (${ask_time}, ${chat_session_id}, TRUE, ${user_question}, ${ChatRole.USER})
    , (${Date.now()}, ${chat_session_id}, FALSE, ${response_content}, ${ChatRole.ASSISTANT})
    `.run()


    return bot_response as ChatResponse
  } catch (err) {
    console.dir(err as RequestError)
    throw err
  }
}


const active_conversation = sql`
  SELECT
    conversation_session_id AS chat_session_id
  , datetime(created_at, 'localtime') as created_at
  , active
  FROM conversation
  WHERE active IS TRUE
  LIMIT 1
`
export async function active(): Promise<Conversation> {
  const record: Conversation | undefined = active_conversation.get() as Conversation
  return record
}

const set_conversation_active = sql`
  UPDATE conversation
  SET active = 1
  WHERE conversation_session_id = :conversation_session_id
  RETURNING
    conversation_session_id AS chat_session_id
  , datetime(created_at, 'localtime') as created_at
  , active
`

export async function activate(conversation_session_id:string): Promise<Conversation | undefined> {
  try {
    sqlite.exec('BEGIN TRANSACTION')
    deactivate_current.run()
    const result = set_conversation_active.get({conversation_session_id})
    sqlite.exec('COMMIT')
    return result as Conversation
  } catch(err) {
    if (sqlite.isTransaction) sqlite.exec('ROLLBACK')
    throw err
  }
}

const add_message = sql`
  INSERT INTO conversation_history(created_at, conversation_session_id, content, role)
  VALUES
    (:user_timestamp, :chat_session_id, :user_content, :user_role)
  , (:response_timestamp, :chat_session_id, :assistant_content, :assistant_role)
`
const get_history = sql`
  SELECT content, role
  FROM conversation_history
  where conversation_session_id = :chat_session_id
  ORDER BY created_at ASC, role DESC
`
export async function proceed(user_question: string, chat_session_id: string) {
  const ask_time = Math.floor(Date.now())

  const next_message = {content: user_question, role: ChatRole.USER}
  const messages = get_history.all({chat_session_id})
  messages.push(next_message)

  const response = await client.post('v1/chat/completions', {
    messages: messages
  , metadata: {chat_session_id}
  })

  const bot_response: ChatResponse = response.data as ChatResponse
  const response_content: string | undefined = bot_response?.choices?.[0].message.content

  add_message.get({
    user_timestamp: ask_time
  , user_content: user_question
  , user_role: ChatRole.USER

  , response_timestamp: Math.floor(Date.now())
  , assistant_content: response_content
  , assistant_role: ChatRole.ASSISTANT
  , chat_session_id: chat_session_id
  })
  return bot_response as ChatResponse
}

let conversation_list = sql`
WITH message_counts AS (
    SELECT
      conversation_history.conversation_session_id
    , conversation.active
    , conversation.conversation_session_id
    , datetime(conversation.created_at, 'unixepoch') as created_at
    , COUNT(*) as message_count
    FROM conversation_history
    INNER JOIN conversation
        ON conversation.conversation_session_id = conversation_history.conversation_session_id
    GROUP BY conversation_history.conversation_session_id
    ORDER BY conversation_history.created_at ASC, conversation_history.role DESC
)
SELECT
  message_counts.created_at
, content AS question
, message_counts.message_count
, active
, message_counts.conversation_session_id
, message_counts.conversation_session_id as pk
FROM conversation_history
INNER JOIN message_counts
    ON message_counts.conversation_session_id = conversation_history.conversation_session_id
WHERE conversation_history.first_message IS TRUE
AND conversation_history.role = 'user'
AND active >= :active_only -- BOOLEANS are really number so you can compare TRUE / FALSE as if they have a value
;
`
export async function list(active_only: boolean = false): Promise<Array<ChatHistory>> {
  return conversation_list.all({active_only: active_only ? 1 : 0}) as Array<ChatHistory>
}

let conversation_get = sql`
WITH message_counts AS (
    SELECT
      conversation_history.conversation_session_id
    , conversation.active
    , conversation.conversation_session_id as pk
    , datetime(conversation.created_at, 'unixepoch') as created_at
    , COUNT(*) as message_count
    , JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'role', conversation_history.role
        , 'content', conversation_history.content
        )
      ) as messages
    FROM conversation_history
    INNER JOIN conversation
        ON conversation.conversation_session_id = conversation_history.conversation_session_id
    WHERE conversation_history.conversation_session_id = :conversation_session_id
    GROUP BY conversation_history.conversation_session_id
    ORDER BY conversation_history.created_at ASC, conversation_history.role DESC
)
SELECT
  message_counts.created_at
, content AS question
, message_counts.message_count
, active
, message_counts.conversation_session_id AS pk
, message_counts.conversation_session_id
, message_counts.messages as message_json
FROM conversation_history
INNER JOIN message_counts
   ON message_counts.conversation_session_id = conversation_history.conversation_session_id
WHERE conversation_history.first_message IS TRUE AND conversation_history.role = 'user'
  AND conversation_history.conversation_session_id = :conversation_session_id
;
`
export async function get(conversation_session_id: string): Promise<ChatHistory> {
  const record: ChatHistory = conversation_get.get({conversation_session_id}) as ChatHistory
  if (!record) return record

  const {message_json, ...payload} = record
  payload.messages = JSON.parse(message_json as string)
  return payload
}


export async function remove(identifiers: Array<string>): Promise<Array<Record<string, string>>> {
  const placholders = identifiers.map(() => {
    return '?'
  })
  const query = `DELETE FROM conversation WHERE conversation_session_id IN (${placholders}) RETURNING conversation_session_id as pk`
  return sqlite.prepare(query).all(...identifiers)
}
