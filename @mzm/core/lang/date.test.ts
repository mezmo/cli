import {test} from 'bun:test'
import {assertEquals, assertExists} from '@std/assert'
import {age, parse, toDateTime} from './date.ts'

// Test the age function
test('age - returns empty string for falsy input', () => {
  assertEquals(age(null as any), '')
  assertEquals(age(undefined as any), '')
  assertEquals(age('' as any), '')
  assertEquals(age(0 as any), '')
})

test('age - handles Date object from several days ago', () => {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  const result = age(threeDaysAgo)
  assertEquals(result, '3d')
})

test('age - handles Date object from several hours ago', () => {
  const fiveHoursAgo = new Date()
  fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5)
  const result = age(fiveHoursAgo)
  // Should show hours since it's less than a day
  assertEquals(result, '5h')
})

test('age - handles Date object from several minutes ago', () => {
  const thirtyMinutesAgo = new Date()
  thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30)
  const result = age(thirtyMinutesAgo)
  assertEquals(result, '30m')
})

test('age - handles date string from days ago', () => {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  const result = age(twoDaysAgo.toISOString())
  assertEquals(result, '2d')
})

test('age - handles date string from hours ago', () => {
  const tenHoursAgo = new Date()
  tenHoursAgo.setHours(tenHoursAgo.getHours() - 10)
  const result = age(tenHoursAgo.toISOString())
  assertEquals(result, '10h')
})

test('age - handles date string from minutes ago', () => {
  const fifteenMinutesAgo = new Date()
  fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)
  const result = age(fifteenMinutesAgo.toISOString())
  assertEquals(result, '15m')
})

test('age - prioritizes days over hours', () => {
  // 1 day and 12 hours ago
  const dateInPast = new Date()
  dateInPast.setDate(dateInPast.getDate() - 1)
  dateInPast.setHours(dateInPast.getHours() - 12)
  const result = age(dateInPast)
  assertEquals(result, '1d')
})

test('age - prioritizes hours over minutes', () => {
  // 2 hours and 30 minutes ago
  const dateInPast = new Date()
  dateInPast.setHours(dateInPast.getHours() - 2)
  dateInPast.setMinutes(dateInPast.getMinutes() - 30)
  const result = age(dateInPast)
  assertEquals(result, '2h')
})

test('age - handles very recent date (less than a minute)', () => {
  const thirtySecondsAgo = new Date()
  thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30)
  const result = age(thirtySecondsAgo)
  assertEquals(result, '0m')
})

test('age - handles exactly one day ago', () => {
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  const result = age(oneDayAgo)
  assertEquals(result, '1d')
})

test('age - handles exactly one hour ago', () => {
  const oneHourAgo = new Date()
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)
  const result = age(oneHourAgo)
  assertEquals(result, '1h')
})

test('age - handles exactly one minute ago', () => {
  const oneMinuteAgo = new Date()
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1)
  const result = age(oneMinuteAgo)
  assertEquals(result, '1m')
})

test('age - handles week-old date', () => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const result = age(oneWeekAgo)
  assertEquals(result, '7d')
})

test('age - handles month-old date', () => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const result = age(oneMonthAgo)
  // Should show approximately 30 days (may vary based on the month)
  const days = parseInt(result.replace('d', ''))
  assertEquals(days >= 28 && days <= 31, true)
})

test('age - handles future date', () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const result = age(tomorrow)
  // Future dates will show positive values since difference(future, past) is positive
  // The difference function calculates (now - source_date), but for future dates
  // this becomes negative internally, but the function returns absolute values
  assertEquals(result, '1d')
})

test('age - handles ISO 8601 date string', () => {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  const isoString = twoDaysAgo.toISOString()
  const result = age(isoString)
  assertEquals(result, '2d')
})

test('age - handles date string in different format', () => {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  // Use a different date format
  const dateString = threeDaysAgo.toDateString()
  const result = age(dateString)
  // toDateString() loses time information, so it might be 2d or 3d depending on the time of day
  const days = parseInt(result.replace('d', ''))
  assertEquals(days >= 2 && days <= 3, true)
})

test('age - handles invalid date string', () => {
  const result = age('invalid-date')
  // Invalid dates result in NaN when converted, which shows as NaNm
  assertEquals(result, '')
})

test('age - handles current date', () => {
  const now = new Date()
  const result = age(now)
  assertEquals(result, '0m')
})

// Test the parse function
test('parse - handles number input (timestamp)', () => {
  const timestamp = 1704067200000 // Jan 1, 2024 00:00:00 UTC
  const result = parse(timestamp)
  assertExists(result)
  assertEquals(result?.getTime(), timestamp)
})

test('parse - handles number input as string', () => {
  const timestamp = '1704067200000' // Jan 1, 2024 00:00:00 UTC as string
  const result = parse(timestamp)
  assertExists(result)
  assertEquals(result?.getTime(), 1704067200000)
})

test('parse - handles ISO date string', () => {
  const isoString = '2024-01-01T12:00:00Z'
  const result = parse(isoString)
  assertExists(result)
  assertEquals(result?.toISOString(), '2024-01-01T12:00:00.000Z')
})

test('parse - handles natural language string (tomorrow)', () => {
  const result = parse('tomorrow')
  assertExists(result)

  // Check that the result is roughly 24 hours from now
  const now = new Date()
  const diffInMs = result!.getTime() - now.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)

  // Should be approximately 24 hours in the future (with some tolerance for test execution time)
  assertEquals(Math.round(diffInHours), 24)
})

test('parse - handles natural language string (yesterday)', () => {
  const result = parse('yesterday')
  assertExists(result)

  // Check that the result is roughly 24 hours ago
  const now = new Date()
  const diffInMs = now.getTime() - result!.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)

  // Should be approximately 24 hours in the past
  assertEquals(Math.round(diffInHours), 24)
})

test('parse - handles custom parser for christmas', () => {
  const result = parse('christmas')
  assertExists(result)
  assertEquals(result?.getMonth(), 11) // December (0-indexed)
  assertEquals(result?.getDate(), 25)
})

test('parse - handles relative date string (next week)', () => {
  const result = parse('next week')
  assertExists(result)

  // Check that the result is roughly 7 days from now
  const now = new Date()
  const diffInMs = result!.getTime() - now.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  // Should be approximately 7 days in the future
  assertEquals(Math.round(diffInDays), 7)
})

test('parse - handles standard date format string', () => {
  const dateString = '2024-03-15'
  const result = parse(dateString)
  assertExists(result)
  assertEquals(result?.getFullYear(), 2024)
  assertEquals(result?.getMonth(), 2) // March (0-indexed)
  assertEquals(result?.getDate(), 15)
})

test('parse - returns null for invalid string that chrono cannot parse', () => {
  const result = parse('this is not a valid date string at all')
  assertEquals(result, null)
})

test('parse - handles date string with time', () => {
  const dateString = 'January 15, 2024 14:30:00'
  const result = parse(dateString)
  assertExists(result)
  assertEquals(result?.getFullYear(), 2024)
  assertEquals(result?.getMonth(), 0) // January (0-indexed)
  assertEquals(result?.getDate(), 15)
  assertEquals(result?.getHours(), 14)
  assertEquals(result?.getMinutes(), 30)
})

test('parse - handles zero as number input', () => {
  const result = parse(0)
  assertExists(result)
  assertEquals(result?.getTime(), 0) // Unix epoch
  assertEquals(result?.toISOString(), '1970-01-01T00:00:00.000Z')
})

test('parse - handles negative number (date before epoch)', () => {
  const timestamp = -86400000 // -1 day from epoch
  const result = parse(timestamp)
  assertExists(result)
  assertEquals(result?.getTime(), timestamp)
  assertEquals(result?.toISOString(), '1969-12-31T00:00:00.000Z')
})

// Test the toDateTime function
test('toDateTime - converts valid timestamp to ZonedDateTime with default timezone', () => {
  // Use a timestamp in the middle of the day to avoid timezone boundary issues
  const timestamp = 1704124800000 // Jan 1, 2024 16:00:00 UTC
  const result = toDateTime(timestamp)
  assertExists(result)
  // Just check that we got a valid ZonedDateTime with the system timezone
  assertExists(result?.timeZoneId)
  assertEquals(result?.timeZoneId, Temporal.Now.timeZoneId())
})

test('toDateTime - converts valid timestamp to ZonedDateTime with specific timezone', () => {
  // Use a timestamp in the middle of the day to avoid date boundary issues
  const timestamp = 1704124800000 // Jan 1, 2024 16:00:00 UTC
  const result = toDateTime(timestamp, 'UTC')
  assertExists(result)
  assertEquals(result?.year, 2024)
  assertEquals(result?.timeZoneId, 'UTC')
  assertEquals(result?.month, 1)
  assertEquals(result?.day, 1)
  assertEquals(result?.hour, 16)
})

test('toDateTime - converts ISO string to ZonedDateTime', () => {
  const isoString = '2024-06-15T10:30:00Z'
  const result = toDateTime(isoString, 'America/New_York')
  assertExists(result)
  assertEquals(result?.year, 2024)
  assertEquals(result?.timeZoneId, 'America/New_York')
  assertEquals(result?.month, 6)
  assertEquals(result?.day, 15)
  // Hour will be 6 in New York time (10 UTC - 4 hours for EDT)
  assertEquals(result?.hour, 6)
  assertEquals(result?.minute, 30)
})

test('toDateTime - converts natural language string to ZonedDateTime', () => {
  const result = toDateTime('tomorrow', 'Europe/London')
  assertExists(result)
  assertEquals(result?.timeZoneId, 'Europe/London')

  // Verify it's roughly tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  assertEquals(result?.year, tomorrow.getFullYear())
})

test('toDateTime - returns null for invalid input', () => {
  const result = toDateTime('this is not a valid date')
  assertEquals(result, null)
})

test('toDateTime - handles christmas with specific timezone', () => {
  const result = toDateTime('christmas', 'Asia/Tokyo')
  assertExists(result)
  assertEquals(result?.timeZoneId, 'Asia/Tokyo')
  assertEquals(result?.month, 12)
  // The day might be 25 or 26 depending on the time of day and timezone offset
  // Christmas parsed by chrono gives us Dec 25 at 12:00 noon in local time
  // When converted to Asia/Tokyo, it could be Dec 25 or 26
  // So we just check that it's December in Tokyo timezone
  assertExists(result?.day)
})

test('toDateTime - uses system timezone when not specified', () => {
  const timestamp = Date.now()
  const result = toDateTime(timestamp)
  assertExists(result)
  // The timezone should be the system's default
  assertEquals(result?.timeZoneId, Temporal.Now.timeZoneId())
})

test('toDateTime - handles date with all time components', () => {
  const dateString = '2024-07-20T15:45:30.250Z'
  const result = toDateTime(dateString, 'UTC')
  assertExists(result)
  assertEquals(result?.year, 2024)
  assertEquals(result?.month, 7)
  assertEquals(result?.day, 20)
  assertEquals(result?.hour, 15)
  assertEquals(result?.minute, 45)
  assertEquals(result?.second, 30)
  assertEquals(result?.millisecond, 250)
})

test('toDateTime - handles date with zero time components', () => {
  const dateString = '2024-01-01T00:00:00.000Z'
  const result = toDateTime(dateString, 'UTC')
  assertExists(result)
  assertEquals(result?.year, 2024)
  assertEquals(result?.month, 1)
  assertEquals(result?.day, 1)
  // When hours, minutes, seconds, milliseconds are 0, they default to 0 in Temporal
  assertEquals(result?.hour, 0)
  assertEquals(result?.minute, 0)
  assertEquals(result?.second, 0)
  assertEquals(result?.millisecond, 0)
})

test('toDateTime - handles string number input', () => {
  // Use a timestamp in the middle of the day
  const timestamp = '1704124800000' // Jan 1, 2024 16:00:00 UTC
  const result = toDateTime(timestamp, 'Pacific/Auckland')
  assertExists(result)
  // Auckland is UTC+13 in January (summer time)
  assertEquals(result?.year, 2024)
  assertEquals(result?.month, 1)
  assertEquals(result?.day, 2) // It's Jan 2 in Auckland when it's Jan 1 16:00 UTC
  assertEquals(result?.timeZoneId, 'Pacific/Auckland')
})

test('toDateTime - handles date with partial time components', () => {
  const dateString = '2024-03-15T08:30:00.000Z'
  const result = toDateTime(dateString, 'UTC')
  assertExists(result)
  assertEquals(result?.year, 2024)
  assertEquals(result?.month, 3)
  assertEquals(result?.day, 15)
  assertEquals(result?.hour, 8)
  assertEquals(result?.minute, 30)
  assertEquals(result?.second, 0)
  assertEquals(result?.millisecond, 0)
})

// Additional tests for edge cases and code coverage
test('parse - handles falsy string input', () => {
  const result = parse('')
  assertEquals(result, null)
})

test('parse - handles non-date string that Date constructor accepts', () => {
  const result = parse('2024-12-31')
  assertExists(result)
  assertEquals(result?.getFullYear(), 2024)
  assertEquals(result?.getMonth(), 11) // December
  assertEquals(result?.getDate(), 31)
})

test('toDateTime - handles date with only hour set', () => {
  const dateString = '2024-01-01T05:00:00.000Z'
  const result = toDateTime(dateString, 'UTC')
  assertExists(result)
  assertEquals(result?.hour, 5)
  assertEquals(result?.minute, 0)
  assertEquals(result?.second, 0)
  assertEquals(result?.millisecond, 0)
})

test('toDateTime - handles date with minutes but no seconds', () => {
  const dateString = '2024-01-01T00:15:00.000Z'
  const result = toDateTime(dateString, 'UTC')
  assertExists(result)
  assertEquals(result?.hour, 0)
  assertEquals(result?.minute, 15)
  assertEquals(result?.second, 0)
  assertEquals(result?.millisecond, 0)
})

test('toDateTime - handles date with seconds but no milliseconds', () => {
  const dateString = '2024-01-01T00:00:45.000Z'
  const result = toDateTime(dateString, 'UTC')
  assertExists(result)
  assertEquals(result?.hour, 0)
  assertEquals(result?.minute, 0)
  assertEquals(result?.second, 45)
  assertEquals(result?.millisecond, 0)
})

test('toDateTime - handles date with only milliseconds', () => {
  const dateString = '2024-01-01T00:00:00.500Z'
  const result = toDateTime(dateString, 'UTC')
  assertExists(result)
  assertEquals(result?.hour, 0)
  assertEquals(result?.minute, 0)
  assertEquals(result?.second, 0)
  assertEquals(result?.millisecond, 500)
})

// Tests to reach 100% coverage - covering missing branches
test('parse - handles string that chrono parses but returns NaN', () => {
  // This tests the branch where chrono.parseDate returns null
  // Some strings might be recognized by chrono but still return invalid dates
  const result = parse('Invalid')
  assertEquals(result, null)
})

test('parse - handles boolean input (non-string, non-number)', () => {
  // This tests the default case in the switch statement
  const result = parse(true as any)
  assertEquals(result, null)
})

test('parse - handles object input (non-string, non-number)', () => {
  // This also tests the default case in the switch statement
  const result = parse({} as any)
  assertEquals(result, null)
})

test('parse - handles null input', () => {
  // Tests null input handling
  const result = parse(null as any)
  assertEquals(result, null)
})

test('parse - handles undefined input', () => {
  // Tests undefined input handling
  const result = parse(undefined as any)
  assertEquals(result, null)
})

test('parse - handles array input (converts to NaN)', () => {
  // Array gets converted to NaN by typecast, which goes to number case
  // new Date(NaN) returns an Invalid Date
  const result = parse([] as any)
  assertExists(result)
  assertEquals(result?.toString(), 'Invalid Date')
  assertEquals(isNaN(result!.getTime()), true)
})

test('parse - handles NaN input directly', () => {
  // Direct NaN input should create an Invalid Date
  const result = parse(NaN)
  assertExists(result)
  assertEquals(result?.toString(), 'Invalid Date')
  assertEquals(isNaN(result!.getTime()), true)
})

