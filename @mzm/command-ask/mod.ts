import {EOL} from 'node:os'
import {debuglog} from 'node:util'
import {MZMCommand, prompts, prompt} from '@mzm/core'
import {toArray} from '@mzm/core/lang'
import {default as resource, ChatRole} from '@mzm/core/resource'
import {renderMarkdown} from '@littletof/charmd'
import type {ChatResponse, Conversation, ChatHistory, UserMessage} from '@mzm/core/resource'
const {Input} = prompts
const debug = debuglog('core:command:ask')

export default new MZMCommand()
  .name('ask')
  .usage('[options] [question]')
  .description([
    'Ask questions of the Mezmo Platform Assistant'
  ].join(EOL))
  .arguments('[question]')
  .option('-c, --continue [id:string]', 'continue a previous conversation')
  .action(async function(options: any, question: string | undefined) {
    await prompt([
      {
        name: 'hello'
      , type: Input
      , message: 'How can I help you today?'
      , prefix: ''
      , before: async (inputs: any, next: Function) => {
          let session: Conversation | undefined = undefined

          if (options.continue) {
            if (options.continue === true) session = await resource.v1.conversation.active()
            if (typeof options.continue === 'string') session = await resource.v1.conversation.activate(options.continue)

            if (session) {
              debug('active conversation found. move to collect')
              const conversation: ChatHistory = await resource.v1.conversation.get(session.chat_session_id)
              const messages: Array<UserMessage> = toArray(conversation?.messages) as Array<UserMessage>
              for (const message of messages) {
                if (message.role === ChatRole.USER) console.log(message.content)
                if (message.role === ChatRole.ASSISTANT) console.log(renderMarkdown(message.content))
              }
              return await next('collect') // use the current session
            }
            debug('no session found')
            console.log('Unable to locate that conversation. Let\'s start a new one.')
            return await next()
          }

          if (question) await next('collect')
          debug('No question input - prompting for initial question')
          await next()
        }
      , after: async (inputs: any, next: Function) => {
          const output: ChatResponse = await resource.v1.conversation.create(inputs.hello)
          const chat_session_id: string = `chat.history.${output?.metadata?.chat_session_id}`
          debug('new session started: %s', chat_session_id)
          console.log(renderMarkdown(output?.choices?.[0]?.message?.content))
          await next('collect')
        }
      }, {
        name: 'collect'
      , type: Input
      , message: ''
      , prefix: ''
      , after: async (input: Record<string, string>, next: Function) => {
          if (!input.collect) return await next('collect')
          const conversation = await resource.v1.conversation.active()
          if (!conversation?.chat_session_id) return await next('hello')
          const output: ChatResponse = await resource.v1.conversation.proceed(
            input.collect, conversation.chat_session_id
          )
          console.log(renderMarkdown(output?.choices?.[0]?.message?.content))
          await next('collect')
        }
      }
    ])
  })
