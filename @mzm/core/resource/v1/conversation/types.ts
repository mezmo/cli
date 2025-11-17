export enum ChatRole {
  USER = 'user'
, ASSISTANT = 'assistant'
}

export type UserMessage = {
    content: string
  , role: ChatRole
}

export type ChatHistory = {
  conversation_session_id: string
, pk: string
, created_at: string
, message_count: number
, active: boolean
, question: string
, message_json?: string
, messages?: Array<UserMessage>
}

export type ChatResponseMessage = {
  message: UserMessage
}

export type Conversation = {
  chat_session_id: string
, created_at: string
, active: boolean
}

export type ChatResponse = {
  metadata: {
    chat_session_id: string
  }
, choices: Array<ChatResponseMessage>
}
