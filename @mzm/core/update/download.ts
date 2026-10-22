import * as fs from 'node:fs/promises'
import {debuglog} from 'node:util'
import {CommunicationError} from '../error.ts'

const debug = debuglog('core:command:upgrade:download')

// the first bytes of the executable formats releases are built for
const EXECUTABLE_SIGNATURES: Array<Array<number>> = [
  [0x7f, 0x45, 0x4c, 0x46] // elf (linux)
, [0xcf, 0xfa, 0xed, 0xfe] // mach-o 64 bit (darwin)
, [0xca, 0xfe, 0xba, 0xbe] // mach-o universal (darwin)
, [0x4d, 0x5a] // pe (windows)
]

/**
 * Downloads a file to disk. Nothing is kept on disk unless the whole file was received
 * @param url - location of the file to download
 * @param file - location to write the file to
 * @param timeout - number of milliseconds allowed for the entire download
 * @returns the number of bytes written
 * @throws {CommunicationError} holding the response status when it is anything other than 200
 */
export async function download(url: string, file: string, timeout: number): Promise<number> {
  const response = await fetch(url, {signal: AbortSignal.timeout(timeout)})
  debug('download status %s', response.status)

  if (response.status !== 200) {
    // the content of an error response is of no use. Let go of the connection
    await Promise.allSettled([response.body?.cancel()])
    throw new CommunicationError(response.status, `Unexpected response status: ${response.status}`)
  }

  try {
    const bytes = await Bun.write(file, response)
    debug('%d bytes written to %s', bytes, file)
    return bytes
  } catch (err) {
    // do not leave part of a file behind
    await Promise.allSettled([fs.rm(file)])
    throw err
  }
}

/**
 * Determines if a file starts the way an executable for one of the supported platforms does.
 * Used to catch things like an error or login page that was served in place of a release
 * @param file - location of the file to inspect
 */
export async function isExecutable(file: string): Promise<boolean> {
  let header: Uint8Array
  try {
    header = new Uint8Array(await Bun.file(file).slice(0, 4).arrayBuffer())
  } catch {
    return false
  }

  return EXECUTABLE_SIGNATURES.some((signature) => {
    return signature.every((byte, index) => {
      return header[index] === byte
    })
  })
}
