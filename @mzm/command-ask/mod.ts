import {EOL} from 'node:os'
import {debuglog} from 'node:util'
import {MZMCommand, prompts, prompt, colors} from '@mzm/core'
import {toArray} from '@mzm/core/lang'
import {default as resource, ChatRole} from '@mzm/core/resource'
import {renderMarkdown} from '@littletof/charmd'
import refractor, {visit, CONTINUE} from '@mzm/core/refractor'
import type {Node, Extension, Options} from '@littletof/charmd'
import type {ChatResponse, Conversation, ChatHistory, UserMessage} from '@mzm/core/resource'

const {Input} = prompts
const debug = debuglog('core:command:ask')

function noop(value: string): string {
  return value
}
const THEME: Record<string, (arg: string) => string> = {
  'string': colors.green
, 'keyword': colors.red
, 'number': colors.yellow
, 'comment': colors.dim
, 'operator': colors.magenta
}
const CodeBlockExtension: Extension = {
  generateNode(fn: any, node: Node, parent: Node, options: Options): string | undefined {
    if (node.type !== 'code') return
    if (!refractor.registered(node.lang)) return
    const ast = refractor.highlight(node.value, node.lang)
    visit(ast, 'text', (node: Node, _: number, parent: Node) => {
      if (parent.type === 'root') return CONTINUE
      // @ts-ignore there isn't a matching type for the output of refractor
      const type = parent.properties.className[1]
      const fn = THEME[type] ?? noop
      // @ts-ignore typescript doesn't understand early returns
      node.value = fn(node.value)
    })
    const txt = render(ast)
    return txt
  }
}

function render(node: Node): string {
  let output = ''

  if (node.type === 'text') return node.value

  if (Array.isArray(node.children)) {
    for (const child of node.children) output += render(child)
  }

  return output

}

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
        // deno-lint-ignore ban-types
      , before: async (_inputs: any, next: Function) => {
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
                if (message.role === ChatRole.ASSISTANT) console.log(renderMarkdown(message.content, {
                  extensions: [CodeBlockExtension]
                }))
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
        // deno-lint-ignore ban-types
      , after: async (inputs: any, next: Function) => {
          const output: ChatResponse = await resource.v1.conversation.create(inputs.hello)
          const chat_session_id: string = `chat.history.${output?.metadata?.chat_session_id}`
          debug('new session started: %s', chat_session_id)
          console.log(renderMarkdown(output?.choices?.[0]?.message?.content, {
            extensions: [CodeBlockExtension]
          }))
          await next('collect')
        }
      }, {
        name: 'collect'
      , type: Input
      , message: ''
      , prefix: ''
        // deno-lint-ignore ban-types
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
