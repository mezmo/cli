import {ConsoleHandler, getLogger, setup, LogLevels, getLevelName} from '@std/log'
import type {LevelName} from '@std/log'
import {storage} from '@mzm/config'
import {str} from '@mzm/core/lang'
import {colors} from '@mzm/core'

const LOGLEVEL = str.upper(
  await storage.getOne('core.log.level') as string ?? getLevelName(LogLevels.ERROR)
)

class StdErrHandler extends ConsoleHandler {
  override log(msg: string) {
    console.error(msg)
  }
}
setup({
  handlers: {
    console: new StdErrHandler('DEBUG')
  },

  loggers: {
    // configure default logger available via short-hand methods above.
    default: {
      level: LOGLEVEL.toUpperCase() as LevelName,
      handlers: ['console'],
    },

    tasks: {
      level: getLevelName(LogLevels.ERROR),
      handlers: ['console'],
    },
  },
})

export {getLogger, colors}
export {pprint} from './render.ts'
