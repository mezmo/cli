import {test} from 'bun:test'
import {assertEquals} from '@std/assert'
import {parse as parseSemver} from '@std/semver'
import {info} from './release.ts'

// Helper to validate semver format
function isValidSemver(version: string): boolean {
  try {
    const parsed = parseSemver(version)
    return parsed !== null
  } catch {
    return false
  }
}

// Helper to validate date format
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

test('info - successfully reads and parses release info', () => {
  const result = info()

  // Verify structure
  assertEquals(typeof result.version, 'string')
  assertEquals(typeof result.release_date, 'string')

  // Verify version is valid semver
  assertEquals(isValidSemver(result.version), true, `Version "${result.version}" should be valid semver`)

  // Verify date is parsable
  assertEquals(isValidDate(result.release_date), true, `Date "${result.release_date}" should be valid ISO date`)
})
