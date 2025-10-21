import {MZMCommand} from '@mzm/core'
import {WebsocketProtocol as PROTOCOL, Socket} from './web-socket.ts'
import type {SocketOptions} from './web-socket.ts'
import {pprint} from '@mzm/log'
import {genHMAC} from '@mzm/core/crypto'
import {toArray} from '@mzm/core/lang'
import {getLogger} from '@mzm/log'

const log = getLogger('tasks')
const secret = 'e1aff34db3'
const param: SocketOptions = {
  email: 'eric.satterwhite@mezmo.com',
  id: '89ebb17ca0',
  ts: Date.now().toString(),
}

function messageCallback(event: CustomEvent) {
  const payload = JSON.parse(event.detail)
  // ignore meta message
  if (payload.e === 'meta') return
  for (const line of payload.p) console.log(pprint(line))
}

function closeCallback(event: CustomEvent) {
  // Normal-ish
  if (event.detail.code === 1005 || event.detail.code === 1000) return

  log.error('lost connection')
  log.error(`[${event.detail.code}]: ${event.detail.reason}`)
}
const tail = new MZMCommand()
  .name('tail')
  .description('Stream logs matching a given search query')
  .arguments('[query:string]')
  .group('Filtering options')
  .option('-H, --host <hostname:string>', 'Host name to filter the log stream', {collect: true})
  .option('-t, --tag <tag:string>', 'tags to filter by', {collect: true})
  .option('-l, --level <level:string>', 'log levels to filter by', {collect: true})
  .option('-a, --app <app:string>', 'log levels to filter by', {collect: true})
  .action(async (options: any, query?: string) => {
    const tail_params: SocketOptions = {
      ...param,
      q: query ?? '',
      hmac: await genHMAC(secret, new URLSearchParams(param).toString()),
    }

    tail_params.hosts = toArray(options.host).join(',')
    tail_params.tags = toArray(options.tag).join(',')
    tail_params.levels = toArray(options.level).join(',')
    tail_params.apps = toArray(options.app).join(',')

    const ws = new Socket(
      `https://tail.use.dev.mezmo.it/ws/tail`
    , [PROTOCOL.JSON]
    , tail_params
    )

    ws.addEventListener('open', () => {
      log.info('web socket connected')
    })

    ws.addEventListener('message', messageCallback as EventListener)
    ws.addEventListener('close', closeCallback as EventListener)

    ws.addEventListener('error', () => {
      log.error('error encountered')
    })

    Deno.addSignalListener('SIGTERM', () => {
      ws.close()
    })
    Deno.addSignalListener('SIGINT', () => {
      ws.close()
    })
    ws.open()
  })

export {tail}
