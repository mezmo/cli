import {test, beforeAll, afterAll, beforeEach} from 'bun:test'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import {assertEquals, assertRejects} from '@std/assert'
import {CommunicationError} from '../error.ts'
import {download, isExecutable} from './download.ts'

const ELF = new Uint8Array([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01, 0x01, 0x00])
const ERROR_PAGE = '<html><body><h1>500 Internal Server Error</h1></body></html>'

let server: ReturnType<typeof Bun.serve>
let tmp_dir: string
let file: string

function url(pathname: string): string {
  return new URL(pathname, server.url).href
}

beforeAll(() => {
  tmp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mzm-download-'))

  // a real http server on a port picked by the operating system
  server = Bun.serve({
    port: 0
  , hostname: '127.0.0.1'
  , routes: {
      '/release': () => {
        return new Response(ELF)
      }
    , '/moved': () => {
        return Response.redirect('/release', 302)
      }
    , '/empty': () => {
        return new Response(null, {status: 200})
      }
    , '/missing': () => {
        return new Response('Not Found', {status: 404})
      }
    , '/forbidden': () => {
        return new Response(ERROR_PAGE, {status: 403})
      }
    , '/broken': () => {
        return new Response(ERROR_PAGE, {status: 500})
      }
    , '/unavailable': () => {
        return new Response(ERROR_PAGE, {status: 503})
      }
    , '/partial': () => {
        return new Response(ELF.slice(0, 4), {status: 206})
      }
    , '/stalled': () => {
        // sends the start of the file and never finishes
        return new Response(new ReadableStream({
          start(controller) {
            controller.enqueue(ELF)
          }
        }))
      }
    }
  })
})

beforeEach(() => {
  file = path.join(tmp_dir, `mzm-${crypto.randomUUID()}`)
})

afterAll(async () => {
  await server.stop(true)
  fs.rmSync(tmp_dir, {recursive: true, force: true})
})

test('download - writes the file', async () => {
  const bytes = await download(url('/release'), file, 5000)
  assertEquals(bytes, ELF.length, 'number of bytes written')
  assertEquals(new Uint8Array(fs.readFileSync(file)), ELF, 'content of the file')
})

test('download - follows redirects', async () => {
  await download(url('/moved'), file, 5000)
  assertEquals(new Uint8Array(fs.readFileSync(file)), ELF, 'content from the location redirected to')
})

test('download - rejects anything other than a 200', async () => {
  const cases = [{
    pathname: '/missing'
  , status: 404
  }, {
    pathname: '/forbidden'
  , status: 403
  }, {
    pathname: '/broken'
  , status: 500
  }, {
    pathname: '/unavailable'
  , status: 503
  }, {
    pathname: '/partial'
  , status: 206
  }, {
    pathname: '/no-such-route'
  , status: 404
  }]

  for (const current of cases) {
    const error = await assertRejects(async () => {
      await download(url(current.pathname), file, 5000)
    }, CommunicationError, `Unexpected response status: ${current.status}`)

    assertEquals(error.status_code, current.status, `${current.pathname}: status is kept on the error`)
    assertEquals(fs.existsSync(file), false, `${current.pathname}: the response is not written to disk`)
  }
})

test('download - times out', async () => {
  const error = await assertRejects(async () => {
    await download(url('/stalled'), file, 200)
  })

  assertEquals((error as Error).name, 'TimeoutError', 'error identifies the time out')
  assertEquals(fs.existsSync(file), false, 'the part that was received is not left on disk')
})

test('download - server cannot be reached', async () => {
  const address = url('/release')
  const closed = Bun.serve({
    port: 0
  , hostname: '127.0.0.1'
  , fetch: () => {
      return new Response(ELF)
    }
  })
  const unreachable = new URL('/release', closed.url).href
  await closed.stop(true)

  await assertRejects(async () => {
    await download(unreachable, file, 5000)
  })
  assertEquals(fs.existsSync(file), false, 'nothing written to disk')

  await download(address, file, 5000)
  assertEquals(fs.existsSync(file), true, 'the running server still answers')
})

test('isExecutable', async () => {
  const cases = [{
    content: ELF
  , expected: true
  , message: 'elf'
  }, {
    content: new Uint8Array([0xcf, 0xfa, 0xed, 0xfe, 0x07, 0x00, 0x00, 0x01])
  , expected: true
  , message: 'mach-o'
  }, {
    content: new Uint8Array([0xca, 0xfe, 0xba, 0xbe, 0x00, 0x00, 0x00, 0x02])
  , expected: true
  , message: 'mach-o universal'
  }, {
    content: new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03])
  , expected: true
  , message: 'windows executable'
  }, {
    content: ERROR_PAGE
  , expected: false
  , message: 'html error page'
  }, {
    content: '{"message": "Not Found"}'
  , expected: false
  , message: 'json error'
  }, {
    content: '#!/bin/sh\necho hello\n'
  , expected: false
  , message: 'shell script'
  }, {
    content: new Uint8Array([0x7f, 0x45])
  , expected: false
  , message: 'file shorter than the signature'
  }, {
    content: ''
  , expected: false
  , message: 'empty file'
  }]

  for (const current of cases) {
    fs.writeFileSync(file, current.content)
    assertEquals(await isExecutable(file), current.expected, current.message)
  }

  assertEquals(await isExecutable(path.join(tmp_dir, 'does-not-exist')), false, 'file that does not exist')
})

test('download - a successful response that is not a program', async () => {
  await download(url('/empty'), file, 5000)
  assertEquals(await isExecutable(file), false, 'empty response is not mistaken for a release')
})
