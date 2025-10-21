import {colors} from '@cliffy/ansi/colors'
import type {LogLine} from './types.ts'

const ERROR_REGEX = /err(?:or)?|crit(?:ical)?|fatal|severe|emerg(?:ENCY)?/i
const WARN_REGEX = /warn(?:ing)?/i
const INFO_REGEX = /info/i
const DEBUG_REGEX = /debug/i
const TRACE_REGEX = /trace/i

const THEME = {
  warn: (value: string) => {
    return colors.black.bgYellow(value)
  },
  error: (value: string) => {
    return colors.white.bgRed(value)
  },
  info: (value: string) => {
    return colors.green.bgBlack(value)
  },
  trace: (value: string) => {
    return colors.blue.bgBlack(value)
  },
  debug: (value: string) => {
    return colors.dim.bgBlack(value)
  },
}

export function pprint(line: LogLine, ) {
  if (!line._host) return ''
  const timestamp = new Date(line._ts).toString()
  const host = line._host
  const app = line._app
  const message = line.message || line._line
  const level = line.level

  const date_string = timestamp.substring(4, 11) + timestamp.substring(16, 24)
  return [
    colors.gray(date_string),
    colors.red(host),
    colors.blue(app),
    colorize(level),
    text(message, level),
  ].join(' ')
}

function colorize(level: string = 'info') {
  if (ERROR_REGEX.test(level)) return THEME.error(` ${level} `)
  if (WARN_REGEX.test(level)) return THEME.warn(` ${level} `)
  if (INFO_REGEX.test(level)) return THEME.info(` ${level} `)
  if (DEBUG_REGEX.test(level)) return THEME.debug(` ${level} `)
  if (TRACE_REGEX.test(level)) return THEME.trace(` ${level} `)
  return level
}

function text(message: string, level: string) {
  if (level == 'debug') return colors.gray(message)
  if (level == 'trace') return colors.gray(message)
  return message
}
