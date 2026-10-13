import {test, beforeEach, afterEach} from 'bun:test'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {assertEquals, assertRejects} from '@std/assert'
import {WINDOWS} from '../platform.ts'
import {swap} from './swap.ts'

let tmp_dir: string
let old_file: string
let new_file: string
let backup_file: string

function files(): Array<string> {
  return fs.readdirSync(tmp_dir).sort()
}

beforeEach(() => {
  tmp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mzm-swap-'))
  old_file = path.join(tmp_dir, 'mzm')
  new_file = path.join(tmp_dir, 'mzm-download')
  backup_file = `${old_file}.1.0.0`
  fs.writeFileSync(old_file, 'version 1.0.0', {mode: 0o755})
})

afterEach(() => {
  fs.rmSync(tmp_dir, {recursive: true, force: true})
})

test('swap - replaces the file', async () => {
  fs.writeFileSync(new_file, 'version 2.0.0', {mode: 0o776})

  const leftover = await swap(old_file, new_file, '1.0.0')

  assertEquals(fs.readFileSync(old_file, 'utf8'), 'version 2.0.0', 'new content is in place')
  assertEquals(fs.existsSync(new_file), false, 'downloaded file is removed')

  if (WINDOWS) {
    // a running executable cannot be removed on windows. It is kept for the next run to clean up
    assertEquals(leftover, backup_file, 'location of the backup copy is returned')
    assertEquals(fs.readFileSync(backup_file, 'utf8'), 'version 1.0.0', 'backup copy holds the original')
    return
  }

  assertEquals(leftover, null, 'nothing left to clean up')
  assertEquals(files(), ['mzm'], 'backup copy is removed')
  assertEquals(fs.statSync(old_file).mode & 0o100, 0o100, 'new file is executable')
})

test('swap - restores the original when the new file cannot be put in place', async () => {
  // the downloaded file is missing, so the copy fails after the original was moved aside
  await assertRejects(async () => {
    await swap(old_file, new_file, '1.0.0')
  }, Error, 'ENOENT')

  assertEquals(files(), ['mzm'], 'only the original file remains')
  assertEquals(fs.readFileSync(old_file, 'utf8'), 'version 1.0.0', 'original content is restored')
})

test('swap - restores the original over a partially written file', async () => {
  // a directory cannot be copied as a file, and stands in for a copy that fails part way
  fs.mkdirSync(new_file)

  await assertRejects(async () => {
    await swap(old_file, new_file, '1.0.0')
  })

  assertEquals(fs.readFileSync(old_file, 'utf8'), 'version 1.0.0', 'original content is restored')
  assertEquals(fs.existsSync(backup_file), false, 'backup copy is moved back')
})

test('swap - leaves everything alone when the original is missing', async () => {
  fs.rmSync(old_file)
  fs.writeFileSync(new_file, 'version 2.0.0')

  await assertRejects(async () => {
    await swap(old_file, new_file, '1.0.0')
  }, Error, 'ENOENT')

  assertEquals(files(), ['mzm-download'], 'downloaded file is not removed')
})
