import {
  assertEquals,
  assertInstanceOf,
  assertExists,
  assertStrictEquals
} from '@std/assert'
import {colors} from '@cliffy/ansi/colors'
import {EOL} from 'node:os'
import {
  GenericError,
  AuthorizationError,
  CommunicationError,
  InputError,
  type ErrorOptions
} from './error.ts'

Deno.test('GenericError - constructor with message', () => {
  const error = new GenericError('Test error message')
  assertInstanceOf(error, GenericError)
  assertInstanceOf(error, Error)
  assertEquals(error.message, 'Test error message')
  assertEquals(error.name, 'GenericError')
  assertEquals(error.error_code, 'ENOOP')
  assertEquals(error.exit_code, 1)
})

Deno.test('GenericError - constructor without message', () => {
  const error = new GenericError()
  assertInstanceOf(error, GenericError)
  assertEquals(error.message, '')
  assertEquals(error.name, 'GenericError')
})

Deno.test('GenericError - constructor with options', () => {
  const options: ErrorOptions = {
    cause: {
      code: 'TEST_CODE',
      help: 'Test help text',
      reason: new Error('Original error')
    }
  }
  const error = new GenericError('Test error', options)
  assertInstanceOf(error, GenericError)
  assertEquals(error.message, 'Test error')
  assertEquals(error.cause, options.cause)
})

Deno.test('GenericError - constructor with partial cause', () => {
  const options: ErrorOptions = {
    cause: {
      code: 'TEST_CODE'
    }
  }
  const error = new GenericError('Test error', options)
  assertEquals(error.cause, options.cause)
})

Deno.test('GenericError - static properties', () => {
  assertEquals(GenericError.error_code, 'ENOOP')
  assertEquals(GenericError.exit_code, 1)
})

Deno.test('GenericError.from() - with message only', () => {
  const error = GenericError.from('Test message')
  assertInstanceOf(error, GenericError)
  assertEquals(error.message, 'Test message')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'ENOOP')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, undefined)
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, undefined)
})

Deno.test('GenericError.from() - with message and help', () => {
  const error = GenericError.from('Test message', 'Help text')
  assertEquals(error.message, 'Test message')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'ENOOP')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, 'Help text')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, undefined)
})

Deno.test('GenericError.from() - with message, help, and reason', () => {
  const originalError = new Error('Original')
  const error = GenericError.from('Test message', 'Help text', originalError)
  assertEquals(error.message, 'Test message')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'ENOOP')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, 'Help text')
  // @ts-ignore - accessing cause for testing
  assertStrictEquals(error.cause.reason, originalError)
})

Deno.test('GenericError.from() - with message and reason but no help', () => {
  const originalError = new Error('Original')
  const error = GenericError.from('Test message', undefined, originalError)
  assertEquals(error.message, 'Test message')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'ENOOP')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, undefined)
  // @ts-ignore - accessing cause for testing
  assertStrictEquals(error.cause.reason, originalError)
})

Deno.test('GenericError.toString() - with code, message and help', () => {
  const error = GenericError.from('Test error message', 'This is help text')
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('ENOOP')}] ${colors.red('Test error message')}`,
    `  This is help text`
  ].join(EOL)
  assertEquals(result, expected)
})

Deno.test('GenericError.toString() - without help text', () => {
  const error = GenericError.from('Test error message')
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('ENOOP')}] ${colors.red('Test error message')}`,
    `  undefined`
  ].join(EOL)
  assertEquals(result, expected)
})

// AuthorizationError Tests
Deno.test('AuthorizationError - constructor', () => {
  const error = new AuthorizationError('Auth failed')
  assertInstanceOf(error, AuthorizationError)
  assertInstanceOf(error, GenericError)
  assertInstanceOf(error, Error)
  assertEquals(error.message, 'Auth failed')
  assertEquals(error.name, 'AuthorizationError')
  assertEquals(error.error_code, 'EAUTH')
  assertEquals(error.exit_code, 2)
})

Deno.test('AuthorizationError - static properties', () => {
  assertEquals(AuthorizationError.error_code, 'EAUTH')
  assertEquals(AuthorizationError.exit_code, 2)
})

Deno.test('AuthorizationError.from() - with help', () => {
  const error = AuthorizationError.from('Please login')
  assertInstanceOf(error, AuthorizationError)
  assertEquals(error.message, 'Unable to authenticate operation')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'EAUTH')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, 'Please login')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, undefined)
})

Deno.test('AuthorizationError.from() - with help and reason', () => {
  const reason = {statusCode: 401}
  const error = AuthorizationError.from('Please login', reason)
  assertEquals(error.message, 'Unable to authenticate operation')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'EAUTH')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, 'Please login')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, reason)
})

Deno.test('AuthorizationError.toString()', () => {
  const error = AuthorizationError.from('Run "mzm auth login" to authenticate')
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EAUTH')}] ${colors.red('Unable to authenticate operation')}`,
    `  Run "mzm auth login" to authenticate`
  ].join(EOL)
  assertEquals(result, expected)
})

// CommunicationError Tests
Deno.test('CommunicationError - constructor with status and message', () => {
  const error = new CommunicationError(500, 'Server error')
  assertInstanceOf(error, CommunicationError)
  assertInstanceOf(error, GenericError)
  assertInstanceOf(error, Error)
  assertEquals(error.message, 'Server error')
  assertEquals(error.name, 'CommunicationError')
  assertEquals(error.error_code, 'ECOMM')
  assertEquals(error.exit_code, 3)
  assertEquals(error.status_code, 500)
})

Deno.test('CommunicationError - constructor with status only', () => {
  const error = new CommunicationError(404)
  assertEquals(error.message, '')
  assertEquals(error.status_code, 404)
})

Deno.test('CommunicationError - constructor with status, message and options', () => {
  const options: ErrorOptions = {
    cause: {
      code: 'NETWORK_ERROR',
      help: 'Check connection',
      reason: new Error('Network failed')
    }
  }
  const error = new CommunicationError(503, 'Service unavailable', options)
  assertEquals(error.message, 'Service unavailable')
  assertEquals(error.status_code, 503)
  assertEquals(error.cause, options.cause)
})

Deno.test('CommunicationError - static properties', () => {
  assertEquals(CommunicationError.error_code, 'ECOMM')
  assertEquals(CommunicationError.exit_code, 3)
})

Deno.test('CommunicationError.from() - with communication reason', () => {
  const reason = {
    status: 503,
    detail: {
      code: 'SERVICE_UNAVAILABLE',
      status: 503,
      message: 'Service is down'
    }
  }
  const error = CommunicationError.from('Try again later', reason)
  assertInstanceOf(error, CommunicationError)
  assertEquals(error.message, 'There was a problem communicating with the Mezmo Platform')
  assertEquals(error.status_code, 503)
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'ECOMM')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, 'Try again later')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, reason)
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.status_code, 503)
})

Deno.test('CommunicationError.from() - reason without detail', () => {
  const reason = {
    status: 400
  } as any
  const error = CommunicationError.from('Bad request', reason)
  assertEquals(error.status_code, 400)
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, reason)
})

Deno.test('CommunicationError.toString()', () => {
  const reason = {
    status: 500,
    detail: {
      code: 'INTERNAL_ERROR',
      status: 500,
      message: 'Internal server error'
    }
  }
  const error = CommunicationError.from('Check server status', reason)
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('ECOMM')}] ${colors.red('There was a problem communicating with the Mezmo Platform')}`,
    `  Check server status`
  ].join(EOL)
  assertEquals(result, expected)
})

// InputError Tests
Deno.test('InputError - constructor', () => {
  const error = new InputError('Invalid input')
  assertInstanceOf(error, InputError)
  assertInstanceOf(error, GenericError)
  assertInstanceOf(error, Error)
  assertEquals(error.message, 'Invalid input')
  assertEquals(error.name, 'InputError')
  assertEquals(error.error_code, 'EINVAL')
  assertEquals(error.exit_code, 4)
})

Deno.test('InputError - static properties', () => {
  assertEquals(InputError.error_code, 'EINVAL')
  assertEquals(InputError.exit_code, 4)
})

Deno.test('InputError.from() - with help only', () => {
  const error = InputError.from('Check your input')
  assertInstanceOf(error, InputError)
  assertEquals(error.message, 'Something about the provided input is invalid')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.code, 'EINVAL')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, 'Check your input')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, undefined)
})

Deno.test('InputError.from() - with validation details', () => {
  const validationErrors = [
    { message: '"name" is required' },
    { message: '"email" must be a valid email address' }
  ]
  const error = InputError.from('Fix validation errors', validationErrors)
  assertEquals(error.message, 'Something about the provided input is invalid')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.help, 'Fix validation errors')
  // @ts-ignore - accessing cause for testing
  assertEquals(error.cause.reason, validationErrors)
})

Deno.test('InputError.toString() - without validation details', () => {
  const error = InputError.from('Please provide valid input')
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EINVAL')}] ${colors.red('Something about the provided input is invalid')}`,
    `  Please provide valid input`
  ].join(EOL)
  assertEquals(result, expected)
})

Deno.test('InputError.toString() - with validation details', () => {
  const validationErrors = [
    { message: '"name" is required' },
    { message: '"email" must be a valid email address' },
    { message: '"age" must be a positive number' }
  ]
  const error = InputError.from('Fix the following errors', validationErrors)
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EINVAL')}] ${colors.red('Something about the provided input is invalid')}`,
    `  Fix the following errors`,
    `   - ${colors.bold(colors.yellow('name'))} is required`,
    `   - ${colors.bold(colors.yellow('email'))} must be a valid email address`,
    `   - ${colors.bold(colors.yellow('age'))} must be a positive number`
  ].join(EOL)
  assertEquals(result, expected)
})

Deno.test('InputError.toString() - validation messages without quoted field names', () => {
  const validationErrors = [
    { message: 'Invalid format' },
    { message: 'Value out of range' }
  ]
  const error = InputError.from('Check input', validationErrors)
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EINVAL')}] ${colors.red('Something about the provided input is invalid')}`,
    `  Check input`,
    `   - Invalid format`,
    `   - Value out of range`
  ].join(EOL)
  assertEquals(result, expected)
})

Deno.test('InputError.toString() - empty validation errors array', () => {
  const error = InputError.from('Check input', [])
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EINVAL')}] ${colors.red('Something about the provided input is invalid')}`,
    `  Check input`
  ].join(EOL)
  assertEquals(result, expected)
})

Deno.test('InputError.toString() - null reason', () => {
  const error = InputError.from('Check input', null)
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EINVAL')}] ${colors.red('Something about the provided input is invalid')}`,
    `  Check input`
  ].join(EOL)
  assertEquals(result, expected)
})

Deno.test('InputError.toString() - undefined reason in cause', () => {
  const error = new InputError('Invalid input', {
    cause: {
      code: 'EINVAL',
      help: 'Fix errors'
    }
  })
  const result = error.toString()
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EINVAL')}] ${colors.red('Invalid input')}`,
    `  Fix errors`
  ].join(EOL)
  assertEquals(result, expected)
})

Deno.test('InputError.toString() - multiple quoted field names in single message', () => {
  const validationErrors = [
    { message: '"firstName" and "lastName" are required' }
  ]
  const error = InputError.from('Complete all fields', validationErrors)
  const result = error.toString()
  // Only the first quoted field gets formatted due to regex replace behavior
  const expected = [
    `${colors.red("✴︎")} [${colors.bold('EINVAL')}] ${colors.red('Something about the provided input is invalid')}`,
    `  Complete all fields`,
    `   - ${colors.bold(colors.yellow('firstName'))} and "lastName" are required`
  ].join(EOL)
  assertEquals(result, expected)
})

// Inheritance chain tests
Deno.test('Error inheritance - all error types inherit properly', () => {
  const genericError = new GenericError('test')
  const authError = new AuthorizationError('test')
  const commError = new CommunicationError(500, 'test')
  const inputError = new InputError('test')

  // All should be instances of Error
  assertInstanceOf(genericError, Error)
  assertInstanceOf(authError, Error)
  assertInstanceOf(commError, Error)
  assertInstanceOf(inputError, Error)

  // All should be instances of GenericError
  assertInstanceOf(genericError, GenericError)
  assertInstanceOf(authError, GenericError)
  assertInstanceOf(commError, GenericError)
  assertInstanceOf(inputError, GenericError)

  // Each should be instance of its own class
  assertInstanceOf(authError, AuthorizationError)
  assertInstanceOf(commError, CommunicationError)
  assertInstanceOf(inputError, InputError)
})

Deno.test('Error inheritance - correct constructor names', () => {
  assertEquals(new GenericError().name, 'GenericError')
  assertEquals(new AuthorizationError().name, 'AuthorizationError')
  assertEquals(new CommunicationError(500).name, 'CommunicationError')
  assertEquals(new InputError().name, 'InputError')
})

// Edge cases for complete coverage
Deno.test('GenericError - captureStackTrace is called', () => {
  const error = new GenericError('test')
  assertExists(error.stack)
})

Deno.test('CommunicationError - captureStackTrace is called', () => {
  const error = new CommunicationError(500, 'test')
  assertExists(error.stack)
})

