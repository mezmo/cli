export enum WebsocketProtocol {
  JSON = 'json',
  XML = 'xml',
}

export type SocketOptions = {
  email: string
  id: string // account id
  ts: string // (+ new Date())
  hmac?: string
  q?: string
  hosts?: string
  tags?: string
  levels?: string
  apps?: string
}

export class Socket extends EventTarget {
  url: URL
  protocols: WebsocketProtocol[] = [WebsocketProtocol.JSON]
  options: object = {}
  ws: WebSocket | null
  connected: boolean = false
  controller: AbortController
  headers: Headers
  reconnect_timer: number | undefined
  reconnect_delay: number = 2000
  constructor(
    url: string,
    options: SocketOptions,
    extra_headers: Headers,
    protocols: WebsocketProtocol[],
  ) {
    super()
    this.url = new URL(url)
    this.controller = new AbortController()
    this.headers = extra_headers

    this.headers.set('User-Agent', '@mzm-cli/0.0.0')
    if (options) this.options
    if (protocols) this.protocols = protocols

    this.ws = null
    if (options) {
      for (const [name, value] of Object.entries(options)) {
        this.url.searchParams.append(name, value)
      }
    }
  }

  open() {
    this.ws = new WebSocket(this.url.toString(), {
      headers: this.headers
    })
    this.ws.addEventListener('open', this.onOpen.bind(this))
    this.ws.addEventListener('close', this.onClose.bind(this))
    this.ws.addEventListener('error', this.onError.bind(this))
    this.ws.addEventListener('message', this.onMessage.bind(this))
  }

  close() {
    this.controller.abort()
    this.ws?.close?.()
    this.ws = null
    clearTimeout(this.reconnect_timer)
  }

  private reconnect() {
    clearTimeout(this.reconnect_timer)
    if (this.controller.signal.aborted) return
    if (this.ws) {
      this.ws.close()
      this.connected = false
    }

    this.reconnect_timer = setTimeout(() => {
      if (this.controller.signal.aborted) return
      this.dispatchEvent(new Event('reconnecting'))
      this.open()
    }, this.reconnect_delay)
  }
  private onOpen() {
    this.connected = true
    this.dispatchEvent(new Event('open'))
  }
  private onClose(evt: CloseEvent) {
    console.log('closed: reconnecting')
    this.dispatchEvent(new CustomEvent('close', {detail: evt}))
    this.reconnect()
  }
  private onError(evt: ErrorEvent | Event) {
    console.log('error: reconnecting')
    this.reconnect()
  }
  private onMessage(evt: MessageEvent) {
    this.dispatchEvent(new CustomEvent('message', {detail: evt.data}))
  }
}
