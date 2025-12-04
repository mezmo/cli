//@ts-nocheck work arround for command extension with views
//TODO(esatterwhite): move views functions to core/resource
import {EOL} from 'node:os'
import {debuglog} from 'node:util'
import {MZMCommand, EnumType} from '@mzm/core'
import {toArray, date} from '@mzm/core/lang'
import {client} from '@mzm/core/resource'
import {pprint, getLogger} from '@mzm/log';
import {storage} from '@mzm/config'

const WINDOWS = Deno.build.os === 'windows'
const log = getLogger('default')
const debug = debuglog('core:command:log:search')
const StartPrefernce = new EnumType(['head', 'tail'])
const OutputFormat = new EnumType(['json', 'pretty'])
const DEFAULT_PAGE_DURATION: Temporal.Duration = Temporal.Duration.from({hours: 2})
const DEFAULT_TO: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO()
const DEFAULT_FROM: Temporal.ZonedDateTime = (DEFAULT_TO.subtract(DEFAULT_PAGE_DURATION))
debug('%o', {
  from: DEFAULT_FROM.epochMilliseconds
, to: DEFAULT_TO.epochMilliseconds
})
const search = new MZMCommand()
  .name('search')
  .usage('[query] [options]')
  .type('preference', StartPrefernce)
  .type('format', OutputFormat)
  .description([
    'Perform paginated search queries over indexed historical data.'
  , 'If the --to and --from flags are omitted the last 2 hours will be searched.'
  ].join(EOL))
  .example(
    'Start new paginated search query using unix timestamps:'
  , 'mzm log search --from=1762198107863 --to=1762198113902 pod:widget-server'
  )
  .example(
    'Start new paginated using natural language time frames:'
  , 'mzm log search --from "last wednesday" --to "now" --with-view'
  )
  .example(
    'Start new paginated with a view:'
  , 'mzm log search --from=1762198107863 --with-view'
  )
  .example(
    'Start new paginated with a subset of views:'
  , 'mzm log search --from 1762198107863 --to 1762198113902 --with-view proxy'
  )
  .example(
    'Start new paginated with a specific view:'
  , 'mzm log search --from "yesterday at 3pm" --to "now" --with-view a2dfe012b'
  )
  .example(
    'Start new paginated using a sub command to find a view by name:'
  , 'mzm log search --from "yesterday at 3pm" --to "now" --with-view $(mzm get view "only errors" -q)'
  )
  .example(
    'Start search query and page throuh all results:'
  , 'mzm log search --from "one hour ago" --all pod:widget-server'
  )
  .example(
    'Get the next page of the last search query:'
  , 'mzm log search --next'
  )
  .example(
    'Page through all remaining pages of a search query:'
  , 'mzm log search --next --all'
  )
  .arguments('[query:string]')
  .group('Filtering options')
  .option('-H, --host <hostname:string>', 'Host name to filter the log stream', {collect: true})
  .option('-t, --tag <tag:string>', 'Tags to filter by', {collect: true})
  .option('-l, --level <level:string>', 'Log levels to filter by', {collect: true})
  .option('-a, --app <app:string>', 'Application names to filter by', {collect: true})
  .option('-n, --limit <lines:number>', 'Maximum Number of lines to request', {default: await storage.getOne('search.page.limit')})
  .option('-v, --with-view [name:string]', 'Search with a predefined view')
  .group('Pagination options')
  .option('-p, --prefer <prefer:preference>', 'Get lines from the beginning of the interval rather than the end', {default: 'tail'})
  .option('--next', 'Get next chunk of lines (after last search). This is a convenience wrapper around the --from and --to parameters.')
  .option('--all', 'Automatically scroll through all pages until search results are exhausted')
  .option('--from <from:string>', 'Unix timestamp of beginning of search timeframe.')
  .option('--to <to:string>', 'Unix timestamp of end of search timeframe.')
  .group('Formatting Options')
  .option('-o, --output [format:format]', 'Print the output in a specific format', {default: 'pretty'})
  .action(async function(options: any, query?: string) {
    const params: Record<string, string> = {
      query: query ?? '_account:*'
    }
    params.prefer = options.prefer;

    if (options.limit) params.size = options.limit
    if (options.from) params.from = date.toDateTime(options.from).epochMilliseconds
    else params.from = DEFAULT_FROM.epochMilliseconds

    if (options.to) params.to = date.toDateTime(options.to).epochMilliseconds
    else params.to = DEFAULT_TO.epochMilliseconds

    if (options.withView) {
      try {
        const view = options.withView === true
        ? await this.promptView()
        : await this.findView(options.withView)
        debug('apply view %s', view.pk)
        params.query = view.query ?? '_account:*'
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

    debug('search params: %o', params)
    if (options.next) {
      const [last_search, pagination_id] = await storage.getMany(
        'search.page.params'
      , 'search.page.next'
      )
      Object.assign(params, last_search)
      if (pagination_id) params.pagination_id = pagination_id
      else return console.log('nothing to display')
    }

    if (options.all && !params.from) return console.log('nothing to display')

    const controller = new AbortController()

    if (!WINDOWS) Deno.addSignalListener('SIGTERM', () => {
      controller.abort()
    })

    Deno.addSignalListener('SIGINT', () => {
      controller.abort()
    })

    Deno.addSignalListener('SIGHUP', () => {
      controller.abort()
    })

    do {
      try {
        // the export endpoint doesn't sort params before trying to encode them
        // which can lead to inconsistent and different pagination cursors
        const sorted = Object.keys(params).sort().reduce((acc, key) => {
          acc[key] = params[key]
          return acc
        }, {})

        const response = await client.get('v2/export', {params: sorted})

        // the error response from this endpoint is just plain text :|
        if (response.status !== 200) return console.log(await response.json())

        const {pagination_id, lines} = response.data

        if (pagination_id) {
          const ttl: number = await storage.getOne('search.page.ttl')
          await Promise.all([
            storage.set('search.page.next', pagination_id, ttl)
          , storage.set('search.page.params', params, ttl)
          ])
          params.pagination_id = pagination_id
        } else {
          await storage.unset('search.page.next')
          await storage.unset('search.page.params')
        }

        if (!lines.length) return console.log('nothing to display')

        for (const line of lines) console.log(pprint(line, options.output === 'json'))
        if (!options.all || !pagination_id) controller.abort()
      } catch (err) {
        log.error('Unable to retrieve search results')
        debug(err)
        return log.error(`[${err.response?.data?.code}] ${err.response?.data.error}`)
      }
    } while (!controller.signal.aborted && params.pagination_id)
  })

export {search}
