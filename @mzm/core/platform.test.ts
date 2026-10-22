import {test} from 'bun:test'
import {assertEquals} from '@std/assert'
import * as platform from './platform.ts'

test('platform.normalizeOS', () => {
  const cases = [{
    value: 'win32'
  , expected: 'windows'
  }, {
    value: 'linux'
  , expected: 'linux'
  }, {
    value: 'darwin'
  , expected: 'darwin'
  }, {
    value: 'freebsd'
  , expected: 'freebsd'
  , message: 'a platform without a release is returned as is'
  }]

  for (const current of cases) {
    assertEquals(
      platform.normalizeOS(current.value)
    , current.expected
    , current.message ?? `normalizeOS(${current.value}) == ${current.expected}`
    )
  }
})

test('platform.normalizeArch', () => {
  const cases = [{
    value: 'x64'
  , expected: 'x86_64'
  }, {
    value: 'arm64'
  , expected: 'aarch64'
  }, {
    value: 'riscv64'
  , expected: 'riscv64'
  , message: 'an architecture without a release is returned as is'
  }]

  for (const current of cases) {
    assertEquals(
      platform.normalizeArch(current.value)
    , current.expected
    , current.message ?? `normalizeArch(${current.value}) == ${current.expected}`
    )
  }
})

test('platform.isCompiled', () => {
  const cases = [{
    value: '/usr/local/bin/mzm'
  , expected: true
  }, {
    value: 'C:\\Users\\mezmo\\bin\\mzm.exe'
  , expected: true
  }, {
    value: '/usr/local/bin/mzm-linux-x86_64'
  , expected: true
  }, {
    value: '/home/mezmo/.bun/bin/bun'
  , expected: false
  }, {
    value: 'C:\\Users\\mezmo\\.bun\\bin\\bun.exe'
  , expected: false
  }, {
    value: 'C:\\Users\\mezmo\\.bun\\bin\\BUN.EXE'
  , expected: false
  , message: 'file names on windows are not case sensitive'
  }, {
    value: '/home/mezmo/.bun/bin/bun-debug'
  , expected: false
  }]

  for (const current of cases) {
    assertEquals(
      platform.isCompiled(current.value)
    , current.expected
    , current.message ?? `isCompiled(${current.value}) == ${current.expected}`
    )
  }

  assertEquals(platform.isCompiled(), false, 'the test suite is run by the bun runtime')
})

test('platform - current process', () => {
  assertEquals(platform.os, platform.normalizeOS(process.platform), 'os')
  assertEquals(platform.arch, platform.normalizeArch(process.arch), 'arch')
  assertEquals(platform.WINDOWS, process.platform === 'win32', 'WINDOWS')
})
