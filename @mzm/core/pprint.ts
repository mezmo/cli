import {colors} from '@cliffy/ansi/colors'

export type LogLine = {
  _host: string
, _app: string
, _ts: Date
, _line: string
, level: string
, message: string
}

const ERROR_REGEX = /err(?:or)?|crit(?:ical)?|fatal|severe|emerg(?:ENCY)?/i
const WARN_REGEX = /warn(?:ing)?/i
const INFO_REGEX = /info/i
const DEBUG_REGEX = /debug/i
const TRACE_REGEX = /trace/i

const THEME = {
  warn: (value: string) => {
    return colors.black.bgYellow(value)
  }
, error: (value: string) => {
    return colors.white.bgRed(value)
  }
, info: (value: string) => {
    return colors.green.bgBlack(value)
  }
, trace: (value: string) => {
    return colors.blue.bgBlack(value)
  }
, debug: (value: string) => {
    return colors.dim.bgBlack(value)
  }
}

/**
 * Formats a log line for display in a terminal
 * @param line - the log line to format
 * @param json - return the line as a json string rather than colorized text
 * @returns the formatted line, or an empty string when the line has no host
 */
export function pprint(line: LogLine, json: boolean = false): string {
  if (!line._host) return ''
  if (json) return JSON.stringify(line)
  const timestamp = new Date(line._ts).toString()
  const host = line._host
  const app = line._app
  const message = line.message || line._line
  const level = line.level

  const date_string = timestamp.substring(4, 11) + timestamp.substring(16, 24)
  return [
    colors.gray(date_string)
  , colors.red(host)
  , colors.blue(app)
  , colorize(level)
  , text(message, level)
  ].join(' ')
}

function colorize(level: string = 'info'): string {
  if (ERROR_REGEX.test(level)) return THEME.error(` ${level} `)
  if (WARN_REGEX.test(level)) return THEME.warn(` ${level} `)
  if (INFO_REGEX.test(level)) return THEME.info(` ${level} `)
  if (DEBUG_REGEX.test(level)) return THEME.debug(` ${level} `)
  if (TRACE_REGEX.test(level)) return THEME.trace(` ${level} `)
  return level
}

function text(message: string, level: string): string {
  if (level === 'debug') return colors.gray(message)
  if (level === 'trace') return colors.gray(message)
  return message
}
