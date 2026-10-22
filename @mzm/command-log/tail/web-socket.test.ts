import {test, beforeAll, afterAll, beforeEach} from 'bun:test'
import {assertEquals} from '@std/assert'
import {info} from '@mzm/core/release'
import {Socket, WebsocketProtocol} from './web-socket.ts'

type Connection = {
  pathname: string
, query: Record<string, string>
, headers: Record<string, string>
}

const LINE = JSON.stringify({e: 'p', p: [{_line: 'hello world'}]})

let server: ReturnType<typeof Bun.serve>
let connections: Array<Connection> = []

function url(pathname: string): string {
  const location = new URL(pathname, server.url)
  location.protocol = 'ws:'
  return location.href
}

function once(target: EventTarget, name: string): Promise<CustomEvent> {
  return new Promise((resolve) => {
    target.addEventListener(name, (event) => {
      resolve(event as CustomEvent)
    }, {once: true})
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

beforeAll(() => {
  // a real web socket server on a port picked by the operating system
  server = Bun.serve<{pathname: string}>({
    port: 0
  , hostname: '127.0.0.1'
  , fetch(request, srv) {
      const location = new URL(request.url)
      connections.push({
        pathname: location.pathname
      , query: Object.fromEntries(location.searchParams)
      , headers: Object.fromEntries(request.headers)
      })

      if (srv.upgrade(request, {data: {pathname: location.pathname}})) return
      return new Response('expected a web socket', {status: 400})
    }
  , websocket: {
      open(ws) {
        // hangs up on everything that connects
        if (ws.data.pathname === '/ws/drop') return ws.close(1011, 'going away')
        ws.send(LINE)
      }
    , message() {}
    }
  })
})

beforeEach(() => {
  connections = []
})

afterAll(async () => {
  await server.stop(true)
})

test('Socket - connection request', async () => {
  const headers = new Headers({Authorization: 'Token abc123'})
  const socket = new Socket(
    url('/ws/tail')
  , {q: 'level:error', hosts: 'one,two', tags: '', levels: '', apps: 'api'}
  , headers
  , false
  , [WebsocketProtocol.JSON]
  )

  const opened = once(socket, 'open')
  socket.open()
  await opened
  socket.close()

  assertEquals(connections.length, 1, 'a single connection is made')
  const [connection] = connections
  assertEquals(connection.pathname, '/ws/tail', 'path of the url is kept')
  assertEquals(connection.query, {
    q: 'level:error'
  , hosts: 'one,two'
  , tags: ''
  , levels: ''
  , apps: 'api'
  }, 'options are sent as query string parameters')
  assertEquals(connection.headers.authorization, 'Token abc123', 'extra headers are sent')
  assertEquals(
    connection.headers['user-agent']
  , `@mzm-cli/${info().version}`
  , 'user agent identifies the command and its version'
  )
  assertEquals(socket.connected, true, 'socket reports being connected')
})

test('Socket - message', async () => {
  const cases = [
    {json: false, message: 'pretty output'}
  , {json: true, message: 'json output'}
  ]

  for (const current of cases) {
    const socket = new Socket(url('/ws/tail'), {q: ''}, new Headers(), current.json, [WebsocketProtocol.JSON])
    const received = once(socket, 'message')
    socket.open()
    const event = await received
    socket.close()

    assertEquals(event.detail, {data: LINE, json: current.json}, current.message)
  }
})

test('Socket - reconnects when the connection is lost', async () => {
  const socket = new Socket(url('/ws/drop'), {q: ''}, new Headers(), false, [WebsocketProtocol.JSON])
  socket.reconnect_delay = 10

  const closed = once(socket, 'close')
  const reconnecting = once(socket, 'reconnecting')
  socket.open()

  const event = await closed
  assertEquals(event.detail.code, 1011, 'close code from the server is passed along')
  assertEquals(event.detail.reason, 'going away', 'close reason from the server is passed along')

  await reconnecting
  // the server hangs up on the second connection as well
  await once(socket, 'close')
  socket.close()

  assertEquals(connections.length, 2, 'a second connection is made')
})

test('Socket - close', async () => {
  const socket = new Socket(url('/ws/drop'), {q: ''}, new Headers(), false, [WebsocketProtocol.JSON])
  socket.reconnect_delay = 10

  let reconnects = 0
  socket.addEventListener('reconnecting', () => {
    reconnects++
  })

  const closed = once(socket, 'close')
  socket.open()
  await closed

  // a reconnect is pending at this point
  socket.close()
  await sleep(socket.reconnect_delay * 5)

  assertEquals(reconnects, 0, 'pending reconnect is cancelled')
  assertEquals(connections.length, 1, 'no further connections are made')
  assertEquals(socket.ws, null, 'underlying web socket is released')
})
