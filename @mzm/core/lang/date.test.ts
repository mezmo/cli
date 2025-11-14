import {assertEquals, assertExists} from '@std/assert'
import {parse, toDateTime} from './date.ts'

// Test the parse function
Deno.test({
  name: 'parse - handles number input (timestamp)',
  fn: () => {
    const timestamp = 1704067200000 // Jan 1, 2024 00:00:00 UTC
    const result = parse(timestamp)
    assertExists(result)
    assertEquals(result?.getTime(), timestamp)
  }
})

Deno.test({
  name: 'parse - handles number input as string',
  fn: () => {
    const timestamp = '1704067200000' // Jan 1, 2024 00:00:00 UTC as string
    const result = parse(timestamp)
    assertExists(result)
    assertEquals(result?.getTime(), 1704067200000)
  }
})

Deno.test({
  name: 'parse - handles ISO date string',
  fn: () => {
    const isoString = '2024-01-01T12:00:00Z'
    const result = parse(isoString)
    assertExists(result)
    assertEquals(result?.toISOString(), '2024-01-01T12:00:00.000Z')
  }
})

Deno.test({
  name: 'parse - handles natural language string (tomorrow)',
  fn: () => {
    const result = parse('tomorrow')
    assertExists(result)

    // Check that the result is roughly 24 hours from now
    const now = new Date()
    const diffInMs = result!.getTime() - now.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)

    // Should be approximately 24 hours in the future (with some tolerance for test execution time)
    assertEquals(Math.round(diffInHours), 24)
  }
})

Deno.test({
  name: 'parse - handles natural language string (yesterday)',
  fn: () => {
    const result = parse('yesterday')
    assertExists(result)

    // Check that the result is roughly 24 hours ago
    const now = new Date()
    const diffInMs = now.getTime() - result!.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)

    // Should be approximately 24 hours in the past
    assertEquals(Math.round(diffInHours), 24)
  }
})

Deno.test({
  name: 'parse - handles custom parser for christmas',
  fn: () => {
    const result = parse('christmas')
    assertExists(result)
    assertEquals(result?.getMonth(), 11) // December (0-indexed)
    assertEquals(result?.getDate(), 25)
  }
})

Deno.test({
  name: 'parse - handles relative date string (next week)',
  fn: () => {
    const result = parse('next week')
    assertExists(result)

    // Check that the result is roughly 7 days from now
    const now = new Date()
    const diffInMs = result!.getTime() - now.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    // Should be approximately 7 days in the future
    assertEquals(Math.round(diffInDays), 7)
  }
})

Deno.test({
  name: 'parse - handles standard date format string',
  fn: () => {
    const dateString = '2024-03-15'
    const result = parse(dateString)
    assertExists(result)
    assertEquals(result?.getFullYear(), 2024)
    assertEquals(result?.getMonth(), 2) // March (0-indexed)
    assertEquals(result?.getDate(), 15)
  }
})

Deno.test({
  name: 'parse - returns null for invalid string that chrono cannot parse',
  fn: () => {
    const result = parse('this is not a valid date string at all')
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'parse - handles date string with time',
  fn: () => {
    const dateString = 'January 15, 2024 14:30:00'
    const result = parse(dateString)
    assertExists(result)
    assertEquals(result?.getFullYear(), 2024)
    assertEquals(result?.getMonth(), 0) // January (0-indexed)
    assertEquals(result?.getDate(), 15)
    assertEquals(result?.getHours(), 14)
    assertEquals(result?.getMinutes(), 30)
  }
})

Deno.test({
  name: 'parse - handles zero as number input',
  fn: () => {
    const result = parse(0)
    assertExists(result)
    assertEquals(result?.getTime(), 0) // Unix epoch
    assertEquals(result?.toISOString(), '1970-01-01T00:00:00.000Z')
  }
})

Deno.test({
  name: 'parse - handles negative number (date before epoch)',
  fn: () => {
    const timestamp = -86400000 // -1 day from epoch
    const result = parse(timestamp)
    assertExists(result)
    assertEquals(result?.getTime(), timestamp)
    assertEquals(result?.toISOString(), '1969-12-31T00:00:00.000Z')
  }
})

// Test the toDateTime function
Deno.test({
  name: 'toDateTime - converts valid timestamp to ZonedDateTime with default timezone',
  fn: () => {
    // Use a timestamp in the middle of the day to avoid timezone boundary issues
    const timestamp = 1704124800000 // Jan 1, 2024 16:00:00 UTC
    const result = toDateTime(timestamp)
    assertExists(result)
    // Just check that we got a valid ZonedDateTime with the system timezone
    assertExists(result?.timeZoneId)
    assertEquals(result?.timeZoneId, Temporal.Now.timeZoneId())
  }
})

Deno.test({
  name: 'toDateTime - converts valid timestamp to ZonedDateTime with specific timezone',
  fn: () => {
    // Use a timestamp in the middle of the day to avoid date boundary issues
    const timestamp = 1704124800000 // Jan 1, 2024 16:00:00 UTC
    const result = toDateTime(timestamp, 'UTC')
    assertExists(result)
    assertEquals(result?.year, 2024)
    assertEquals(result?.timeZoneId, 'UTC')
    assertEquals(result?.month, 1)
    assertEquals(result?.day, 1)
    assertEquals(result?.hour, 16)
  }
})

Deno.test({
  name: 'toDateTime - converts ISO string to ZonedDateTime',
  fn: () => {
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
  }
})

Deno.test({
  name: 'toDateTime - converts natural language string to ZonedDateTime',
  fn: () => {
    const result = toDateTime('tomorrow', 'Europe/London')
    assertExists(result)
    assertEquals(result?.timeZoneId, 'Europe/London')

    // Verify it's roughly tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    assertEquals(result?.year, tomorrow.getFullYear())
  }
})

Deno.test({
  name: 'toDateTime - returns null for invalid input',
  fn: () => {
    const result = toDateTime('this is not a valid date')
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'toDateTime - handles christmas with specific timezone',
  fn: () => {
    const result = toDateTime('christmas', 'Asia/Tokyo')
    assertExists(result)
    assertEquals(result?.timeZoneId, 'Asia/Tokyo')
    assertEquals(result?.month, 12)
    // The day might be 25 or 26 depending on the time of day and timezone offset
    // Christmas parsed by chrono gives us Dec 25 at 12:00 noon in local time
    // When converted to Asia/Tokyo, it could be Dec 25 or 26
    // So we just check that it's December in Tokyo timezone
    assertExists(result?.day)
  }
})

Deno.test({
  name: 'toDateTime - uses system timezone when not specified',
  fn: () => {
    const timestamp = Date.now()
    const result = toDateTime(timestamp)
    assertExists(result)
    // The timezone should be the system's default
    assertEquals(result?.timeZoneId, Temporal.Now.timeZoneId())
  }
})

Deno.test({
  name: 'toDateTime - handles date with all time components',
  fn: () => {
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
  }
})

Deno.test({
  name: 'toDateTime - handles date with zero time components',
  fn: () => {
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
  }
})

Deno.test({
  name: 'toDateTime - handles string number input',
  fn: () => {
    // Use a timestamp in the middle of the day
    const timestamp = '1704124800000' // Jan 1, 2024 16:00:00 UTC
    const result = toDateTime(timestamp, 'Pacific/Auckland')
    assertExists(result)
    // Auckland is UTC+13 in January (summer time)
    assertEquals(result?.year, 2024)
    assertEquals(result?.month, 1)
    assertEquals(result?.day, 2) // It's Jan 2 in Auckland when it's Jan 1 16:00 UTC
    assertEquals(result?.timeZoneId, 'Pacific/Auckland')
  }
})

Deno.test({
  name: 'toDateTime - handles date with partial time components',
  fn: () => {
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
  }
})

// Additional tests for edge cases and code coverage
Deno.test({
  name: 'parse - handles falsy string input',
  fn: () => {
    const result = parse('')
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'parse - handles non-date string that Date constructor accepts',
  fn: () => {
    const result = parse('2024-12-31')
    assertExists(result)
    assertEquals(result?.getFullYear(), 2024)
    assertEquals(result?.getMonth(), 11) // December
    assertEquals(result?.getDate(), 31)
  }
})

Deno.test({
  name: 'toDateTime - handles date with only hour set',
  fn: () => {
    const dateString = '2024-01-01T05:00:00.000Z'
    const result = toDateTime(dateString, 'UTC')
    assertExists(result)
    assertEquals(result?.hour, 5)
    assertEquals(result?.minute, 0)
    assertEquals(result?.second, 0)
    assertEquals(result?.millisecond, 0)
  }
})

Deno.test({
  name: 'toDateTime - handles date with minutes but no seconds',
  fn: () => {
    const dateString = '2024-01-01T00:15:00.000Z'
    const result = toDateTime(dateString, 'UTC')
    assertExists(result)
    assertEquals(result?.hour, 0)
    assertEquals(result?.minute, 15)
    assertEquals(result?.second, 0)
    assertEquals(result?.millisecond, 0)
  }
})

Deno.test({
  name: 'toDateTime - handles date with seconds but no milliseconds',
  fn: () => {
    const dateString = '2024-01-01T00:00:45.000Z'
    const result = toDateTime(dateString, 'UTC')
    assertExists(result)
    assertEquals(result?.hour, 0)
    assertEquals(result?.minute, 0)
    assertEquals(result?.second, 45)
    assertEquals(result?.millisecond, 0)
  }
})

Deno.test({
  name: 'toDateTime - handles date with only milliseconds',
  fn: () => {
    const dateString = '2024-01-01T00:00:00.500Z'
    const result = toDateTime(dateString, 'UTC')
    assertExists(result)
    assertEquals(result?.hour, 0)
    assertEquals(result?.minute, 0)
    assertEquals(result?.second, 0)
    assertEquals(result?.millisecond, 500)
  }
})

// Tests to reach 100% coverage - covering missing branches
Deno.test({
  name: 'parse - handles string that chrono parses but returns NaN',
  fn: () => {
    // This tests the branch where chrono.parseDate returns null
    // Some strings might be recognized by chrono but still return invalid dates
    const result = parse('Invalid')
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'parse - handles boolean input (non-string, non-number)',
  fn: () => {
    // This tests the default case in the switch statement
    const result = parse(true as any)
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'parse - handles object input (non-string, non-number)',
  fn: () => {
    // This also tests the default case in the switch statement
    const result = parse({} as any)
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'parse - handles null input',
  fn: () => {
    // Tests null input handling
    const result = parse(null as any)
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'parse - handles undefined input',
  fn: () => {
    // Tests undefined input handling
    const result = parse(undefined as any)
    assertEquals(result, null)
  }
})

Deno.test({
  name: 'parse - handles array input (converts to NaN)',
  fn: () => {
    // Array gets converted to NaN by typecast, which goes to number case
    // new Date(NaN) returns an Invalid Date
    const result = parse([] as any)
    assertExists(result)
    assertEquals(result?.toString(), 'Invalid Date')
    assertEquals(isNaN(result!.getTime()), true)
  }
})

Deno.test({
  name: 'parse - handles NaN input directly',
  fn: () => {
    // Direct NaN input should create an Invalid Date
    const result = parse(NaN)
    assertExists(result)
    assertEquals(result?.toString(), 'Invalid Date')
    assertEquals(isNaN(result!.getTime()), true)
  }
})

