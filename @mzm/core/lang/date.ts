import {difference} from '@std/datetime'
import * as chrono from '../chrono.vnd.mjs'
import {typecast} from './string.ts'
import {typeOf} from './mod.ts'

const casual = chrono.casual.clone()
casual.parsers.push({
  pattern: () => {
    return /\bchristmas\b/i
  }
, extract: () => {
    return {day: 25, month: 12}
  }
})

export function age(date: Date | string): string {
  if (!date) return ''

  const source_date = typeof date === 'string' ? new Date(date) : date

  // @ts-ignore this is legal
  if (isNaN(source_date)) return ''

  const now = new Date(Temporal.Now.zonedDateTimeISO('UTC').epochMilliseconds)
  const diff = difference(now, source_date, {units: ['days', 'hours', 'minutes']})
  if (diff.days) return `${diff.days}d`
  if (diff.hours) return `${diff.hours}h`
  return `${diff.minutes}m`
}

/**
 * Parses a datetime string or number into a Date object.
 *
 * This function accepts either a string or number representation of a date/time
 * and attempts to parse it into a valid Date object. For strings, it first tries
 * to parse using the chrono library (which supports natural language dates like
 * "tomorrow", "next week", "christmas", etc.), then falls back to the native
 * Date constructor. Numbers are directly converted to Date objects.
 *
 * @param {string|number} datetime - The datetime value to parse. Can be:
 *   - A number representing milliseconds since Unix epoch
 *   - A natural language string (e.g., "tomorrow", "next Monday", "christmas")
 *   - An ISO 8601 date string (e.g., "2024-01-01T12:00:00Z")
 *   - Any string parseable by the native Date constructor
 *
 * @returns {Date|null} A Date object if parsing succeeds, null if the input
 *                       cannot be parsed into a valid date
 *
 * @example
 * // Parse a timestamp
 * parse(1704067200000) // Returns Date object for Jan 1, 2024
 *
 * @example
 * // Parse natural language
 * parse("tomorrow") // Returns Date object for tomorrow
 * parse("christmas") // Returns Date object for Dec 25
 *
 * @example
 * // Parse ISO string
 * parse("2024-01-01T12:00:00Z") // Returns Date object
 *
 * @example
 * // Invalid input
 * parse("not a date") // Returns null
 */
export function parse(datetime: string|number): Date | null {
  const value = typecast(datetime)
  switch (typeOf(value)) {
    case 'number': {
      return new Date(value as number)
    }

    case 'string': {
      let result = casual.parseDate(value as string)
      if (result && !Number.isNaN(result.getTime())) return result

      result = new Date(value as string)
      if (!Number.isNaN(result.getTime())) return result
      return null
    }

    default: {
      return null
    }
  }
}

/**
 * Converts a datetime string or number into a Temporal.ZonedDateTime object.
 *
 * This function first parses the input datetime using the parse() function,
 * then converts the resulting Date object into a Temporal.ZonedDateTime
 * with the specified timezone. The Temporal API provides better timezone
 * handling and more precise date/time operations compared to the native
 * Date object.
 *
 * @param {string|number} datetime - The datetime value to convert. Accepts the
 *                                   same formats as the parse() function
 * @param {string} [tz=Temporal.Now.timeZoneId()] - The timezone identifier for
 *                                                   the resulting ZonedDateTime.
 *                                                   Defaults to the system's
 *                                                   current timezone. Must be a
 *                                                   valid IANA timezone identifier
 *                                                   (e.g., "America/New_York",
 *                                                   "Europe/London", "UTC")
 *
 * @returns {Temporal.ZonedDateTime|null} A Temporal.ZonedDateTime object if
 *                                         parsing succeeds, null if the input
 *                                         cannot be parsed into a valid date
 *
 * @example
 * // Convert to system timezone
 * toDateTime("2024-01-01T12:00:00Z")
 * // Returns ZonedDateTime in system timezone
 *
 * @example
 * // Convert to specific timezone
 * toDateTime("tomorrow", "America/New_York")
 * // Returns tomorrow's date in New York timezone
 *
 * @example
 * // Convert timestamp to Tokyo time
 * toDateTime(1704067200000, "Asia/Tokyo")
 * // Returns ZonedDateTime in Tokyo timezone
 *
 * @example
 * // Invalid input
 * toDateTime("invalid date", "UTC") // Returns null
 */
export function toDateTime(datetime: string|number, tz: string = Temporal.Now.timeZoneId()): Temporal.ZonedDateTime | null {
  const result: Date | null = parse(datetime)
  if (!result) return null

  // Convert the Date to an Instant, then to ZonedDateTime in the target timezone
  // This ensures proper timezone conversion
  const instant = Temporal.Instant.fromEpochMilliseconds(result.getTime())
  return instant.toZonedDateTimeISO(tz)
}
