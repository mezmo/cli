import {assertEquals} from '@std/assert'
import {stub, restore} from '@std/testing/mock'
import {parse as parseSemver} from '@std/semver'
import {info} from './release.ts'

// Helper to create mock release data with valid semver and ISO date
function createMockReleaseData() {
  return {
    release_date: '2024-01-15T10:30:00Z',
    version: '1.2.3'
  }
}

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

Deno.test('info - successfully reads and parses release info', () => {
  const mockData = createMockReleaseData()

  // Stub Deno.readTextFile
  stub(
    Deno,
    'readTextFile',
    // deno-lint-ignore require-await
    async (path: string | URL) => {
      // Verify it's trying to read the correct file
      if (typeof path === 'string' && path.endsWith('release.json')) {
        return JSON.stringify(mockData)
      }
      throw new Error('Unexpected file path')
    }
  )

  try {
    const result = info()

    // Verify structure
    assertEquals(typeof result.version, 'string')
    assertEquals(typeof result.release_date, 'string')

    // Verify version is valid semver
    assertEquals(isValidSemver(result.version), true, `Version "${result.version}" should be valid semver`)

    // Verify date is parsable
    assertEquals(isValidDate(result.release_date), true, `Date "${result.release_date}" should be valid ISO date`)
  } finally {
    // Restore original function
    restore()
  }
})

