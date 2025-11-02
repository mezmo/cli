//@ts-nocheck
import {MZMCommand, EnumType} from '@mzm/core'
import {toArray} from '@mzm/core/lang'
import {client} from '@mzm/core/resource'
import {pprint, getLogger} from '@mzm/log';
import {storage} from '@mzm/config'
import {debuglog} from 'node:util'

const log = getLogger('default')
const debug = debuglog('cmd:log')

const StartPrefernce = new EnumType(['head', 'tail'])
const search = new MZMCommand()
  .name('search')
  .type('preference', StartPrefernce)
  .description('Perform one of search queries')
  .arguments('[query:string]')
  .group('Filtering options')
  .option('-H, --host <hostname:string>', 'Host name to filter the log stream', {collect: true})
  .option('-t, --tag <tag:string>', 'tags to filter by', {collect: true})
  .option('-l, --level <level:string>', 'log levels to filter by', {collect: true})
  .option('-a, --app <app:string>', 'log levels to filter by', {collect: true})
  .option('-n, --limit <lines:number>', 'Maximum Number of lines to request', {default: 10})
  .option('-v, --with-view [name:string]', 'Search with with a predefined view')
  .group('Pagination options')
  .option('-p, --prefer <prefer:preference>', 'Get lines from the beginning of the interval rather than the end', {default: 'tail'})
  .option('--next', 'Get next chunk of lines (after last search). This is a convenience wrapper around the --from and --to parameters.')
  .option('--all', 'Automatically scroll through all pages until search results are exhausted')
  .option('--timeframe <timeframe>', 'Natural Language Timeframe via Chrono. Wrap in quotes. IE "today 5PM to 7PM" or "yesterday at 3PM to now" or "May 26 at 4PM UTC". If only one time is given, "from" is assumed.')
  .option('--from <from:number>', 'Unix/Natural Language timestamp of beginning of search timeframe. Wrap in quotes if NL. Ignored if --timeframe used.')
  .option('--to <to:number>', 'Unix/Natural Language timestamp of end of search timeframe. Wrap in quotes if NL. Ignored if --timeframe used.')
  .group('Output Options')
  .option('-j, --json', 'Output raw JSON')
  .action(async function(options: any, query?: string) {
    const params: Record<string, string> = {
      query: query ?? ''
    }
    params.prefer = options.prefer;

    if (options.from) params.from = new Date(parseInt(options.from)).getTime().toString()
    if (options.limit) params.size = options.limit
    if (options.to) params.to = new Date(parseInt(options.to)).getTime().toString()

    if (options.withView) {
      try {
        const view = options.withView === true
        ? await this.promptView()
        : await this.findView(options.withView)
        params.query = view.query
        options.host = view.hosts
        options.tag = view.tags
        options.level = view.levels
        options.app = view.apps
      } catch (err) {
        log.error('Unable to retrieve views')
        return log.error(`[${err.response?.data?.code}] ${err.response?.data.error}`)
      }
    }

    if (options.host) params.hosts = toArray(options.host).join(',')
    if (options.tag) params.tags = toArray(options.tag).join(',')
    if (options.level) params.levels = toArray(options.level).join(',')
    if (options.app) params.apps = toArray(options.app).join(',')

    if (options.next) params.pagination_id = await storage.getOne('search.page.next')

    const API_HOST = await storage.getOne('core.host.api')
    const controller = new AbortController()

    debug('api host: %s', API_HOST)

    Deno.addSignalListener('SIGTERM', () => {
      controller.abort()
    })
    Deno.addSignalListener('SIGINT', () => {
      controller.abort()
    })

    do {
      try {
        const response = await client.get('v2/export', {params})

        // the error response from this endpoint is just plain text :|
        if (response.status !== 200) return console.log(await response.json())

        const {pagination_id: next, lines} = response.data
        params.pagination_id = next

        if (next) await storage.set('search.page.next', next, 1000 * 60)
        if (!lines.length) return console.log('nothing to display')

        for (const line of lines) console.log(pprint(line))
        if (!options.all) controller.abort()
      } catch (err) {
        log.error('Unable to retrieve search results')
        return log.error(`[${err.response?.data?.code}] ${err.response?.data.error}`)
      }
    } while (!controller.signal.aborted && params.pagination_id)
  })

export {search}
