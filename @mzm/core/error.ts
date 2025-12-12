import {EOL} from 'node:os'
import {colors} from '@cliffy/ansi/colors'

type ErrorCause = {
    code: string
  , help?: string
  , reason?: unknown
}

/**
 * Options for creating custom error instances.
 *
 * @interface ErrorOptions
 * @property {Object} cause - The cause object containing error details
 * @property {string} cause.code - Error code identifier (e.g., 'EAUTH', 'ECOMM')
 * @property {string} [cause.help] - Optional help text to guide users on resolving the error
 * @property {unknown} [cause.reason] - Optional underlying reason or additional error details
 */
export type ErrorOptions = {
  cause: ErrorCause
}

type CommunicationReason = {
  status: number
, detail: {code: string, status: number, message: string}
}

/**
 * Base error class for all custom errors in the Mezmo CLI.
 * Provides structured error handling with error codes, exit codes, and formatted output.
 *
 * @class GenericError
 * @extends {Error}
 *
 * @example
 * // Create a generic error with custom message
 * const error = new GenericError('Something went wrong', {
 *   cause: {
 *     code: 'ECUSTOM',
 *     help: 'Try running the command again',
 *     reason: originalError
 *   }
 * });
 *
 * @example
 * // Use the static factory method
 * const error = GenericError.from(
 *   'Operation failed',
 *   'Check your configuration',
 *   originalError
 * );
 */
export class GenericError extends Error {
  /** Default error code for the class */
  static error_code: string = 'ENOOP'

  /** Default exit code for the class (used for process exit) */
  static exit_code: number = 1

  /** Instance error code */
  error_code: string = 'ENOOP'

  /** Instance exit code (used for process exit) */
  exit_code: number = 1

  /**
   * Creates an instance of GenericError.
   *
   * @constructor
   * @param {string} [message] - The error message
   * @param {ErrorOptions} [options] - Additional error options including cause details
   */
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    Error.captureStackTrace(this, GenericError)
    this.name = this.constructor.name
    if (options?.cause?.code) this.error_code = options.cause.code
  }

  /**
   * Factory method to create an error instance with structured cause information.
   *
   * @static
   * @param {string} message - The error message
   * @param {string} [help] - Optional help text for resolving the error
   * @param {any} [reason] - Optional underlying error or additional details
   * @returns {GenericError} A new error instance with the specified cause
   *
   * @example
   * const error = GenericError.from(
   *   'Failed to connect',
   *   'Check your network connection',
   *   originalError
   * );
   */
  static from(message: string, help?: string, reason?: any) {
    const cause = Object.create(null)
    cause.code = this.error_code
    if (help) cause.help = help
    if (reason) cause.reason = reason
    if (reason?.code) cause.code = reason.code

    const err = new this(message, {cause})
    return err
  }

  /**
   * Returns a formatted string representation of the error for display to users.
   * Includes colored output with error code, message, and help text.
   *
   * @override
   * @returns {string} Formatted error string with ANSI colors
   *
   * @example
   * console.log(error.toString());
   * // Output: ✴︎ [ENOOP] Error message
   * //         Help text here
   */
  override toString(): string {
    return [
      // @ts-ignore typescript is wrong
      `${colors.red("✴︎")} [${colors.bold(this.cause.code)}] ${colors.red(this.message)}`
      // @ts-ignore typescript is wrong
    , `  ${this.cause.help}`
    ].join(EOL)
  }
}

/**
 * Error class for authentication and authorization failures.
 * Used when operations fail due to missing or invalid credentials.
 *
 * @class AuthorizationError
 * @extends {GenericError}
 *
 * @example
 * // Create an authorization error
 * const error = AuthorizationError.from(
 *   'Please login using "mzm auth login"',
 *   { statusCode: 401 }
 * );
 */
export class AuthorizationError extends GenericError {
  /** Error code for authorization errors */
  static override error_code: string = 'EAUTH'

  /** Exit code for authorization errors */
  static override exit_code: number = 2

  /** Instance error code for authorization errors */
  override error_code: string = 'EAUTH'

  /** Instance exit code for authorization errors */
  override exit_code: number = 2

  /**
   * Factory method to create an authorization error with a standard message.
   *
   * @static
   * @override
   * @param {string} help - Help text for resolving the authorization issue
   * @param {unknown} [reason] - Optional underlying error or additional details
   * @returns {AuthorizationError} A new authorization error instance
   *
   * @example
   * throw AuthorizationError.from(
   *   'Run "mzm auth login" to authenticate'
   * );
   */
  static override from(help: string, reason?: unknown) {
    return super.from(
      'Unable to authenticate operation'
    , help
    , reason
    )
  }
}

/**
 * Error class for communication failures with the Mezmo platform.
 * Used when network requests fail or API calls encounter errors.
 *
 * @class CommunicationError
 * @extends {GenericError}
 *
 * @example
 * // Create a communication error with status code
 * const error = CommunicationError.from(
 *   'The server is temporarily unavailable',
 *   { statusCode: 503, response: serverResponse }
 * );
 * error.status_code = 503;
 */
export class CommunicationError extends GenericError {
  /** Error code for communication errors */
  static override error_code: string = 'ECOMM'

  /** Exit code for communication errors */
  static override exit_code: number = 3

  /** Instance error code for communication errors */
  override error_code: string = 'ECOMM'

  /** Instance exit code for communication errors */
  override exit_code: number = 3

  /** HTTP status code associated with the communication error */
  public status_code: number = 500

  constructor(status: number, message?: string, options?: ErrorOptions) {
    super(message, options)
    Error.captureStackTrace(this, CommunicationError)
    this.name = this.constructor.name
    this.status_code = status

    if (options?.cause?.code) this.error_code = options.cause.code

  }

  /**
   * Factory method to create a communication error with a standard message.
   *
   * @static
   * @override
   * @param {string} help - Help text for resolving the communication issue
   * @param {unknown} [reason] - Optional underlying error or additional details
   * @returns {CommunicationError} A new communication error instance
   *
   * @example
   * throw CommunicationError.from(
   *   'Check your internet connection and try again',
   *   networkError
   * );
   */
  static override from(help: string, reason: unknown) {
    const cast = reason as CommunicationReason
    const err = new this(
      cast.status
    , 'There was a problem communicating with the Mezmo Platform'
    , {
        cause: {
          code: cast.detail?.code || this.error_code
        , help: help
        , reason: cast
        , status_code: cast.status
        } as ErrorCause & {status_code: number}
      }
    )

    err.status_code = cast.status || err.status_code
    err.error_code = cast.detail?.code || err.error_code

    return err
  }
}

/**
 * Error class for input validation failures.
 * Used when user-provided input doesn't meet requirements or validation rules.
 * Supports detailed validation error messages for multiple fields.
 *
 * @class InputError
 * @extends {GenericError}
 *
 * @example
 * // Create an input error with validation details
 * const error = InputError.from(
 *   'Please provide valid input values',
 *   [
 *     { message: '"name" is required' },
 *     { message: '"email" must be a valid email address' }
 *   ]
 * );
 */
export class InputError extends GenericError {

  /** Error code for input validation errors */
  static override error_code: string = 'EINVAL'

  /** Exit code for input validation errors */
  static override exit_code: number = 4

  /** Instance error code for input validation errors */
  override error_code: string = 'EINVAL'

  /** Instance exit code for input validation errors */
  override exit_code: number = 4

  /**
   * Returns a formatted string representation of the input error.
   * Includes the main error message, help text, and detailed validation errors.
   * Field names in validation messages are highlighted in yellow.
   *
   * @override
   * @returns {string} Formatted error string with validation details
   *
   * @example
   * console.log(error.toString());
   * // Output: ✴︎ [EINVAL] Something about the provided input is invalid
   * //         Please check your input
   * //          - "name" is required
   * //          - "email" must be valid
   */
  override toString(): string {
    const msg = [
      // @ts-ignore typescript is wrong
      `${colors.red("✴︎")} [${colors.bold(this.cause.code)}] ${colors.red(this.message)}`
      // @ts-ignore typescript is wrong
    , `  ${this.cause.help}`
    ]

    // @ts-ignore typescript is wrong
    const details = (this?.cause as Record<string, string>).reason ?? []
    for (const item of details) {
      // @ts-ignore typescript is wrong
      const formatted = item.message.replace(/\"(\w+)\"/, (_, key: string) => {
        return colors.bold(colors.yellow(key))
      })
      msg.push(
        `   - ${formatted}`
      )
    }
    return msg.join(EOL)
  }

  /**
   * Factory method to create an input validation error with a standard message.
   *
   * @static
   * @override
   * @param {string} help - Help text for resolving the validation issue
   * @param {any} [reason] - Optional validation error details (typically an array of validation errors)
   * @returns {InputError} A new input error instance
   *
   * @example
   * throw InputError.from(
   *   'Review the validation errors above',
   *   validationErrors
   * );
   */
  static override from(help: string, reason?: any) {
    return super.from(
      'Something about the provided input is invalid'
    , help
    , reason
    )
  }
}

export class ClientError extends GenericError {

  /** Error code for input validation errors */
  static override error_code: string = 'EINVAL'

  /** Exit code for input validation errors */
  static override exit_code: number = 5

  /** Instance error code for input validation errors */
  override error_code: string = 'EINVAL'

  /** Instance exit code for input validation errors */
  override exit_code: number = 5

  /**
   * Factory method to create an input validation error with a standard message.
   *
   * @static
   * @override
   * @param {string} help - Help text for resolving the validation issue
   * @param {any} [reason] - Optional validation error details (typically an array of validation errors)
   * @returns {InputError} A new input error instance
   *
   * @example
   * throw InputError.from(
   *   'Review the validation errors above',
   *   validationErrors
   * );
   */
  static override from(help: string, reason?: any) {
    return super.from(
      'Something about the provided input is invalid'
    , help
    , reason
    )
  }
}

export class NotFoundError extends GenericError {
  static override error_code: string = 'ENOENT'
  static override exit_code: number = 6
  override error_code: string = 'ENOENT'
  override exit_code: number = 6
  static override from(help: string, reason?: any) {
    return super.from(
      'Not Found'
    , help
    , reason
    )
  }
}
