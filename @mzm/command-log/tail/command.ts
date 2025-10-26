//@ts-nocheck
import {MZMCommand} from '@mzm/core'
import {WebsocketProtocol as PROTOCOL, Socket} from './web-socket.ts'
import type {SocketOptions} from './web-socket.ts'
import {storage} from '@mzm/config'
import {pprint} from '@mzm/log'
import {genHMAC} from '@mzm/core/crypto'
import {toArray} from '@mzm/core/lang'
import {getLogger} from '@mzm/log'

const log = getLogger('default')
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
  .option('-v, --with-view', 'Stream logs matching a predefined view')
  .action(async function(options: any, query?: string) {
    const STREAM_HOST = await storage.getOne('core.host.stream')
    log.debug(`stream host: ${STREAM_HOST}`)

    // TODO(esatterwhite): to remove when IAM key support lands on livetail
    const tail_params: SocketOptions = {
      ...param,
      q: query ?? '',
      hmac: await genHMAC(secret, new URLSearchParams(param).toString()),
    }

    if (options.withView) {
      try {
        const view = await this.promptView(options.accessKey)
        tail_params.q = view.query
        options.host = view.hosts
        options.tag = view.tags
        options.level = view.levels
        options.app = view.apps
      } catch (err) {
        log.error('Unable to retrieve veiws')
        return log.error(`[${err.response?.data?.code}] ${err.response?.data.error}`)
      }
    }
    tail_params.hosts = toArray(options.host).join(',')
    tail_params.tags = toArray(options.tag).join(',')
    tail_params.levels = toArray(options.level).join(',')
    tail_params.apps = toArray(options.app).join(',')

    const ws = new Socket(
      `${STREAM_HOST}/ws/tail`
    , tail_params
    , new Headers({
        Authorization: `Token ${options.accessKey}`
    })
    , [PROTOCOL.JSON]
    )

    ws.addEventListener('open', () => {
      log.info(`web socket connected: ${STREAM_HOST}`)
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
