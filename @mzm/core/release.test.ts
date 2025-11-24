import {assertEquals, assertRejects, assertThrows} from '@std/assert'
import {stub, restore} from '@std/testing/mock'
import {parse as parseSemver} from '@std/semver'
import {info, infoSync} from './release.ts'

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

Deno.test('info - successfully reads and parses release info', async () => {
  const mockData = createMockReleaseData()

  // Stub Deno.readTextFile
  stub(
    Deno,
    'readTextFile',
    async (path: string | URL) => {
      // Verify it's trying to read the correct file
      if (typeof path === 'string' && path.endsWith('release.info')) {
        return JSON.stringify(mockData)
      }
      throw new Error('Unexpected file path')
    }
  )

  try {
    const result = await info()

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

Deno.test('info - handles invalid JSON', async () => {
  // Stub Deno.readTextFile to return invalid JSON
  stub(
    Deno,
    'readTextFile',
    async (path: string | URL) => {
      if (typeof path === 'string' && path.endsWith('release.info')) {
        return 'invalid json {'
      }
      throw new Error('Unexpected file path')
    }
  )

  try {
    await assertRejects(
      async () => await info(),
      SyntaxError
    )
  } finally {
    restore()
  }
})

Deno.test('info - handles file read error', async () => {
  // Stub Deno.readTextFile to throw an error
  stub(
    Deno,
    'readTextFile',
    async (_path: string | URL) => {
      throw new Deno.errors.NotFound('File not found')
    }
  )

  try {
    await assertRejects(
      async () => await info(),
      Deno.errors.NotFound,
      'File not found'
    )
  } finally {
    restore()
  }
})

Deno.test('infoSync - successfully reads and parses release info', () => {
  const mockData = createMockReleaseData()

  // Stub Deno.readTextFileSync
  stub(
    Deno,
    'readTextFileSync',
    (path: string | URL) => {
      // Verify it's trying to read the correct file
      if (typeof path === 'string' && path.endsWith('release.info')) {
        return JSON.stringify(mockData)
      }
      throw new Error('Unexpected file path')
    }
  )

  try {
    const result = infoSync()

    // Verify structure
    assertEquals(typeof result.version, 'string')
    assertEquals(typeof result.release_date, 'string')

    // Verify version is valid semver
    assertEquals(isValidSemver(result.version), true, `Version "${result.version}" should be valid semver`)

    // Verify date is parsable
    assertEquals(isValidDate(result.release_date), true, `Date "${result.release_date}" should be valid ISO date`)
  } finally {
    restore()
  }
})

Deno.test('infoSync - handles invalid JSON', () => {
  // Stub Deno.readTextFileSync to return invalid JSON
  stub(
    Deno,
    'readTextFileSync',
    (path: string | URL) => {
      if (typeof path === 'string' && path.endsWith('release.info')) {
        return '{ "version": "1.0.0", invalid }'
      }
      throw new Error('Unexpected file path')
    }
  )

  try {
    let error_thrown = false
    try {
      infoSync()
    } catch (error) {
      error_thrown = true
      assertEquals(error instanceof SyntaxError, true)
    }
    assertEquals(error_thrown, true, 'Expected SyntaxError to be thrown')
  } finally {
    restore()
  }
})

Deno.test('infoSync - handles file read error', () => {
  // Stub Deno.readTextFileSync to throw an error
  stub(
    Deno,
    'readTextFileSync',
    (_path: string | URL) => {
      throw new Deno.errors.NotFound('File not found')
    }
  )

  assertThrows(infoSync, Deno.errors.NotFound, 'File not found', 'Expected error to be thrown')
  restore()
})

Deno.test('info - verifies correct file path construction', async () => {
  let capturedPath = ''

  // Stub Deno.readTextFile to capture the path
  stub(
    Deno,
    'readTextFile',
    async (path: string | URL) => {
      capturedPath = typeof path === 'string' ? path : path.toString()
      return JSON.stringify(createMockReleaseData())
    }
  )

  try {
    await info()
    // Verify the path ends with release.info
    // The path is constructed by going up two directories from the current module location
    assertEquals(capturedPath.endsWith('release.info'), true, 'Path should end with release.info')
    // Verify it's an absolute path (should contain forward slashes and likely starts with /)
    assertEquals(capturedPath.includes('/'), true, 'Path should be absolute with forward slashes')
  } finally {
    restore()
  }
})

Deno.test('infoSync - verifies correct file path construction', () => {
  let capturedPath = ''

  // Stub Deno.readTextFileSync to capture the path
  stub(
    Deno,
    'readTextFileSync',
    (path: string | URL) => {
      capturedPath = typeof path === 'string' ? path : path.toString()
      return JSON.stringify(createMockReleaseData())
    }
  )

  try {
    infoSync()
    // Verify the path ends with release.info
    // The path is constructed by going up two directories from the current module location
    assertEquals(capturedPath.endsWith('release.info'), true, 'Path should end with release.info')
    // Verify it's an absolute path (should contain forward slashes and likely starts with /)
    assertEquals(capturedPath.includes('/'), true, 'Path should be absolute with forward slashes')
  } finally {
    restore()
  }
})

Deno.test('info - handles empty JSON object', async () => {
  // Stub Deno.readTextFile to return empty JSON object
  stub(
    Deno,
    'readTextFile',
    async (path: string | URL) => {
      if (typeof path === 'string' && path.endsWith('release.info')) {
        return '{}'
      }
      throw new Error('Unexpected file path')
    }
  )

  try {
    const result = await info()
    // Should parse successfully but fields will be undefined
    assertEquals(typeof result, 'object')
    assertEquals(result.version, undefined)
    assertEquals(result.release_date, undefined)
  } finally {
    restore()
  }
})

Deno.test('infoSync - handles empty JSON object', () => {
  // Stub Deno.readTextFileSync to return empty JSON object
  stub(
    Deno,
    'readTextFileSync',
    (path: string | URL) => {
      if (typeof path === 'string' && path.endsWith('release.info')) {
        return '{}'
      }
      throw new Error('Unexpected file path')
    }
  )

  try {
    const result = infoSync()
    // Should parse successfully but fields will be undefined
    assertEquals(typeof result, 'object')
    assertEquals(result.version, undefined)
    assertEquals(result.release_date, undefined)
  } finally {
    restore()
  }
})

