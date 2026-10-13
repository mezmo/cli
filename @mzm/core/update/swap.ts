import * as fs from 'node:fs/promises'
import {debuglog} from 'node:util'
import {WINDOWS} from '../platform.ts'

const debug = debuglog('core:command:upgrade:swap')

async function hide(file: string): Promise<void> {
  const child = Bun.spawn(['cmd', '/c', 'attrib', '+h', file], {
    stdin: 'ignore'
  , stdout: 'ignore'
  , stderr: 'ignore'
  })
  await child.exited
}

/**
 * Replaces a file with a new one, putting the original back if the new one cannot be put in place
 * @param old_file - location of the file to be replaced
 * @param new_file - location of the file replacing it. It is removed when the swap is done
 * @param version - version of the file being replaced. Used to name the backup copy
 * @param verify - called with the location of the new file once it is in place.
 *  The original file is restored if it throws
 * @returns the location of the backup copy when it could not be removed (windows), otherwise null.
 *  It is left to the caller to arrange for it to be removed later
 * @throws when the new file could not be put in place, or was rejected by `verify`.
 *  The original file is restored first
 */
export async function swap(
  old_file: string
, new_file: string
, version: string
, verify?: (file: string) => Promise<void>
): Promise<string | null> {
  const backup_file = `${old_file}.${version}`

  // On windows you cannot remove or overwrite a file while it is running
  // We can rename, and remove later. Keeping the original around until
  // the new file is in place also gives us something to roll back to
  debug('file swap', {old_file, new_file, backup_file})
  await fs.rename(old_file, backup_file)
  debug('file renamed %s', backup_file)

  try {
    // copy tmp file to <file>
    // moving / and $HOME likely spans devices, which makes simple rename not possible
    // poor mans mv (copy + remove)
    debug(`copy %s to %s`, new_file, old_file)
    await fs.copyFile(new_file, old_file)

    // the original is still around. This is the last point the new file can be turned down
    if (verify) await verify(old_file)
  } catch (err) {
    // put the original back, replacing anything that was partially written or turned down
    debug('swap failed. restoring %s', old_file)
    await fs.rename(backup_file, old_file)
    await Promise.allSettled([fs.rm(new_file)])
    throw err
  }

  // its not terribly important that the temp file is removed
  await Promise.allSettled([fs.rm(new_file)])

  if (WINDOWS) {
    // attempt to make the file hidden
    // its ok if this fails
    await Promise.allSettled([hide(backup_file)])
    debug('windows executable swap complete')
    return backup_file
  }

  await Promise.allSettled([fs.rm(backup_file)])
  return null
}
