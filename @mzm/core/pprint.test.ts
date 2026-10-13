import {test} from 'bun:test'
import {assertEquals} from '@std/assert'
import {colors} from '@cliffy/ansi/colors'
import {pprint, type LogLine} from './pprint.ts'

const TIMESTAMP = new Date(2024, 0, 15, 10, 30, 45)

function line(overrides: Partial<LogLine> = {}): LogLine {
  return {
    _host: 'web-01'
  , _app: 'api'
  , _ts: TIMESTAMP
  , _line: 'raw line'
  , level: 'info'
  , message: 'request complete'
  , ...overrides
  }
}

test('pprint - line without a host', () => {
  assertEquals(pprint(line({_host: ''})), '', 'nothing to print')
  assertEquals(pprint(line({_host: ''}), true), '', 'nothing to print as json')
})

test('pprint - json', () => {
  const input = line()
  assertEquals(pprint(input, true), JSON.stringify(input), 'line is returned as json')
})

test('pprint - text', () => {
  assertEquals(pprint(line()), [
    colors.gray('Jan 15 10:30:45')
  , colors.red('web-01')
  , colors.blue('api')
  , colors.green.bgBlack(' info ')
  , 'request complete'
  ].join(' '), 'date, host, app, level and message')

  assertEquals(
    colors.stripAnsiCode(pprint(line({message: ''})))
  , 'Jan 15 10:30:45 web-01 api  info  raw line'
  , 'the raw line is used when there is no message'
  )
})

test('pprint - levels', () => {
  const cases = [{
    level: 'error'
  , expected: colors.white.bgRed(' error ')
  }, {
    level: 'CRITICAL'
  , expected: colors.white.bgRed(' CRITICAL ')
  }, {
    level: 'warning'
  , expected: colors.black.bgYellow(' warning ')
  }, {
    level: 'INFO'
  , expected: colors.green.bgBlack(' INFO ')
  }, {
    level: 'debug'
  , expected: colors.dim.bgBlack(' debug ')
  , message: colors.gray('request complete')
  }, {
    level: 'trace'
  , expected: colors.blue.bgBlack(' trace ')
  , message: colors.gray('request complete')
  }, {
    level: 'notice'
  , expected: 'notice'
  }]

  for (const current of cases) {
    const output = pprint(line({level: current.level}))
    assertEquals(
      output.endsWith(`${current.expected} ${current.message ?? 'request complete'}`)
    , true
    , `level ${current.level}: ${output}`
    )
  }
})
