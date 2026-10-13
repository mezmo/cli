import {debuglog} from 'node:util'

const debug = debuglog('core:command:upgrade:verify')
const DEFAULT_TIMEOUT = 1000 * 30

/**
 * Makes sure a copy of the command can be started on this machine.
 * A release can arrive intact and still be unable to run. Things like an operating system
 * that is too old for it, or a code signature the operating system does not accept
 * @param file - location of the executable to try
 * @param timeout - number of milliseconds to wait for it to finish
 * @throws when the executable cannot be started, is stopped by the operating system,
 *  does not finish in time or reports a failure
 */
export async function verify(file: string, timeout: number = DEFAULT_TIMEOUT): Promise<void> {
  // every version of the command is able to print its help
  const child = Bun.spawn([file, '--help'], {
    stdin: 'ignore'
  , stdout: 'ignore'
  , stderr: 'ignore'
  , timeout: timeout
  , killSignal: 'SIGKILL'
  })

  const exit_code = await child.exited
  debug('%s exited %o', file, {exit_code, signal: child.signalCode})

  if (child.signalCode) throw new Error(`${file} was stopped by ${child.signalCode}`)
  if (exit_code !== 0) throw new Error(`${file} exited with code ${exit_code}`)
}
