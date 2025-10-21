import {ConsoleHandler, getLogger, setup, LogLevels, LogLevelNames, getLevelName} from '@std/log'

setup({
  handlers: {
    console: new ConsoleHandler('DEBUG'),
  },

  loggers: {
    // configure default logger available via short-hand methods above.
    default: {
      level: getLevelName(LogLevels.DEBUG),
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
