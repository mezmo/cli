import {MZMCommand, EnumType} from '@mzm/core'
import {toArray} from '@mzm/core/lang'
import {pprint} from '@mzm/log';
import {storage} from '@mzm/config'
import {debuglog} from 'node:util'

const log = debuglog('cmd:log')

//TODO(esatterwhite) add a temp storage interface
async function lastID() {
  return ''
}

const StartPrefernce = new EnumType(['head', 'tail'])
const search = new MZMCommand()
  .name('search')
  .type('preference', StartPrefernce)
  .description('Perform one of search queries')
  .arguments('<query:string>')
  .group('Filtering options')
  .option('-H, --host <hostname:string>', 'Host name to filter the log stream', {collect: true})
  .option('-t, --tag <tag:string>', 'tags to filter by', {collect: true})
  .option('-l, --level <level:string>', 'log levels to filter by', {collect: true})
  .option('-a, --app <app:string>', 'log levels to filter by', {collect: true})
  .option('-n, --limit <lines:number>', 'Maximum Number of lines to request', {default: 10})
  .group('Pagination options')
  .option('-p, --prefer <prefer:preference>', 'Get lines from the beginning of the interval rather than the end', {default: 'tail'})
  .option('--next', 'Get next chunk of lines (after last search). This is a convenience wrapper around the --from and --to parameters.')
  .option('--timeframe <timeframe>', 'Natural Language Timeframe via Chrono. Wrap in quotes. IE "today 5PM to 7PM" or "yesterday at 3PM to now" or "May 26 at 4PM UTC". If only one time is given, "from" is assumed.')
  .option('--from <from:number>', 'Unix/Natural Language timestamp of beginning of search timeframe. Wrap in quotes if NL. Ignored if --timeframe used.')
  .option('--to <to:number>', 'Unix/Natural Language timestamp of end of search timeframe. Wrap in quotes if NL. Ignored if --timeframe used.')
  .group('Output Options')
  .option('-j, --json', 'Output raw JSON')
  .action(async (options: any, query?: string) => {
    const params: Record<string, string> = {
      query: query ?? ''
    }

    params.prefer = options.prefer;
    if (options.from) params.from = new Date(parseInt(options.from)).getTime().toString()
    if (options.limit) params.size = options.limit
    if (options.to) params.to = new Date(parseInt(options.to)).getTime().toString()
    if (options.host) params.hosts = toArray(options.host).join(',')
    if (options.tag) params.tags = toArray(options.tag).join(',')
    if (options.level) params.levels = toArray(options.level).join(',')
    if (options.app) params.apps = toArray(options.app).join(',')

    if (options.next) params.pagination_id = await lastID() ?? ''

    const API_HOST = await storage.getOne('core.host.api')
    const controller = new AbortController()

    log('api host: %s', API_HOST)

    Deno.addSignalListener('SIGTERM', () => {
      controller.abort()
    })
    Deno.addSignalListener('SIGINT', () => {
      controller.abort()
    })

    do {
      const url = 'https://api.use.dev.mezmo.it/v2/export?' + new URLSearchParams(params).toString()
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${options.accessKey}`
        }
      })
      const body = await response.json()
      const {pagination_id: next, lines} = body
      params.pagination_id = next
      if (!lines.length) return console.log('nothing to display')

      for (const line of lines) console.log(pprint(line))
    } while (!controller.signal.aborted && params.pagination_id)
  })

export {search}
