import {MZMCommand, EnumType, Table, RowType, yaml, Cell} from "@mzm/core";
import {toArray} from '@mzm/core/lang'
import {default as resource} from '@mzm/core/resource'
import type {ChatHistory} from '@mzm/core/resource'

const OutputFormat = new EnumType(['table', 'json', 'yaml'])
export default new MZMCommand()
  .name('conversation')
  .description('Interact with previous conversation with the Mezmo AI Assistant.')
  .alias('chat')
  .arguments('[id:string]')
  .type('format', OutputFormat)
  .option('-o, --output [format:format]', 'Print the outout in a specific format', {default: 'table'})
  .option('-q, --quiet', 'Only print out identifiers than formated text output')
  .option('-a, --active', 'Get the currently active conversation')
  .action(async function(options: any, conversation_id?: string) {
    const output = new Table().padding(8)
    const conversations: Array<ChatHistory> = toArray(
      conversation_id
      ? await resource.v1.conversation.get(conversation_id)
      : await resource.v1.conversation.list(!!options.active)
    ) as Array<ChatHistory>

    switch(options.output) {
      case 'json': {
        const output = conversation_id ? conversations[0] : conversations
        return console.log(JSON.stringify(output, null, 2))
      }
      case 'yaml': {
        const output = conversation_id ? conversations[0] : conversations
        return console.log(yaml.stringify(output))
      }
      case 'table': {
        const body: RowType[] = []
        output.header(['Active', 'Created', 'Question', 'Messages', 'ID'])

        if (options.quiet) {
          const identifiers: Array<string> = conversations.map((conversation: ChatHistory) => {
            return conversation.conversation_session_id
          })
          return console.log(identifiers.join(' '))
        }

        for (const conversation of conversations) {
          body.push([
           new Cell(conversation.active ? '*' : '').align('center')
          , conversation.created_at
          , conversation.question
          , new Cell(conversation.message_count / 2).align('center')
          , conversation.conversation_session_id
          ])
        }
        output.body(body).render()
      }
    }
  })
