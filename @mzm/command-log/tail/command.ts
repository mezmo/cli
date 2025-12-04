import {MZMCommand, EnumType, colors} from '@mzm/core'
import type {RequestError} from '@mzm/core'
import {WebsocketProtocol as PROTOCOL, Socket} from './web-socket.ts'
import {AuthorizationError} from '@mzm/core/error'
import type {SocketOptions} from './web-socket.ts'
import {storage} from '@mzm/config'
import {pprint} from '@mzm/log'
import {toArray} from '@mzm/core/lang'
import {getLogger} from '@mzm/log'

const log = getLogger('default')
const OutputFormat = new EnumType(['json', 'pretty'])
const WINDOWS = Deno.build.os === 'windows'
function messageCallback(event: CustomEvent) {
  const payload = JSON.parse(event.detail.data)
  // ignore meta message
  if (payload.e === 'meta') return
  for (const line of payload.p) console.log(pprint(line, event.detail.json))
}

function closeCallback(event: CustomEvent) {
  // Normal-ish
  if (event.detail.code === 1005 || event.detail.code === 1000) return

  log.error('lost connection')
  log.error(`[${event.detail.code}]: ${event.detail.reason}`)
}

const tail = new MZMCommand()
  .name('tail')
  .usage('[query] [options]')
  .description('Stream logs matching a given search query')
  .type('format', OutputFormat)
  .example(
    'Tail error logs for a specific application:'
  , 'mzm log tail -a <app> -l error'
  )
  .example(
    'Tail for a specific application with a query filter:'
  , 'mzm log tail -a <app> "level:-(debug OR trace) missing cred"'
  )
  .arguments('[query:string]')
  .group('Filtering options')
  .option('-H, --host <hostname:string>', 'Host name to filter the log stream', {collect: true})
  .option('-t, --tag <tag:string>', 'tags to filter by', {collect: true})
  .option('-l, --level <level:string>', 'log levels to filter by', {collect: true})
  .option('-a, --app <app:string>', 'log levels to filter by', {collect: true})
  .option('-v, --with-view [name:string]', 'Stream logs matching a predefined view')
  .group('Formatting options')
  .option('-o, --output [format:format]', 'Output raw JSON', {default: 'pretty'})
  .action(async function(options: any, query?: string) {
    const ACCESS_KEY: string | undefined = options.accessKey ?? ''
    if (!ACCESS_KEY) throw AuthorizationError.from(
      `Make sure the environment variable ${colors.magenta('MZM_ACCESS_KEY')} is set`
    )
    const STREAM_HOST = await storage.getOne('core.host.stream')
    const headers = new Headers()
    log.debug(`stream host: ${STREAM_HOST}`)

    // TODO(esatterwhite): to remove when IAM key support lands on livetail
    const tail_params: SocketOptions = {
      q: query ?? ''
    }

    if (options.withView) {
      try {
        const view = options.withView === true
        //@ts-ignore work around for command subclassing
        ? await this.promptView()
        //@ts-ignore work around for command subclassing
        : await this.findView(options.withView)

        if (view.query) tail_params.q = view.query
        options.host = view.hosts
        options.tag = view.tags
        options.level = view.levels
        options.app = view.apps
      } catch (err) {
        const error = err as RequestError
        log.error('Unable to retrieve views')
        console.dir(err)
        //@ts-ignore these errors are mostly defined as unknown
        return log.error(`[${error.response?.data?.code}] ${error.response?.data.error}`)
      }
    }

    tail_params.hosts = toArray(options.host).join(',')
    tail_params.tags = toArray(options.tag).join(',')
    tail_params.levels = toArray(options.level).join(',')
    tail_params.apps = toArray(options.app).join(',')

    headers.append('Authorization', `Token ${ACCESS_KEY}`)

    const ws = new Socket(
      `${STREAM_HOST}/ws/tail`
    , tail_params
    , headers
    , options.output === 'json'
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

    if (!WINDOWS) Deno.addSignalListener('SIGTERM', () => {
      ws.close()
    })

    Deno.addSignalListener('SIGINT', () => {
      ws.close()
    })

    Deno.addSignalListener('SIGHUP', () => {
      ws.close()
    })

    ws.open()
  })

export {tail}
