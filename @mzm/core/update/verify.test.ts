import {test, beforeEach, afterEach} from 'bun:test'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {assertRejects} from '@std/assert'
import {WINDOWS} from '../platform.ts'
import {verify} from './verify.ts'

let tmp_dir: string

// the stand in for a release is a shell script, which windows has no way to run
const unix = test.skipIf(WINDOWS)

function script(name: string, body: string): string {
  const file = path.join(tmp_dir, name)
  fs.writeFileSync(file, `#!/bin/sh\n${body}\n`, {mode: 0o755})
  return file
}

beforeEach(() => {
  tmp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mzm-verify-'))
})

afterEach(() => {
  fs.rmSync(tmp_dir, {recursive: true, force: true})
})

unix('verify - accepts a program that runs', async () => {
  await verify(script('mzm', '[ "$1" = "--help" ] || exit 9'))
})

test('verify - accepts the runtime running the tests', async () => {
  await verify(process.execPath)
})

unix('verify - rejects a program that reports a failure', async () => {
  await assertRejects(async () => {
    await verify(script('mzm', 'exit 3'))
  }, Error, 'exited with code 3')
})

unix('verify - rejects a program stopped by the operating system', async () => {
  // what happens to a program with a code signature macos does not accept
  await assertRejects(async () => {
    await verify(script('mzm', 'kill -9 $$'))
  }, Error, 'SIGKILL')
})

unix('verify - rejects a program that does not finish in time', async () => {
  await assertRejects(async () => {
    await verify(script('mzm', 'sleep 30'), 200)
  }, Error, 'SIGKILL')
})

test('verify - rejects a file that is not a program', async () => {
  const file = path.join(tmp_dir, 'mzm')
  fs.writeFileSync(file, '<html>not found</html>', {mode: 0o755})

  await assertRejects(async () => {
    await verify(file)
  })
})

test('verify - rejects a file that does not exist', async () => {
  await assertRejects(async () => {
    await verify(path.join(tmp_dir, 'missing'))
  })
})
