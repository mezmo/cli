import {ConsoleHandler, getLogger, setup, LogLevels, getLevelName} from '@std/log'
import type {LevelName} from '@std/log'
import {storage} from '@mzm/config'

const LOGLEVEL = await storage.getOne('core.log.level') ?? getLevelName(LogLevels.ERROR)
setup({
  handlers: {
    console: new ConsoleHandler('DEBUG'),
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

export {getLogger}
export {pprint} from './render.ts'
