export enum WebsocketProtocol {
  JSON = 'json',
  XML = 'xml',
}

export type SocketOptions = {
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
  json: boolean = false
  constructor(
    url: string,
    options: SocketOptions,
    extra_headers: Headers,
    json: boolean = false,
    protocols: WebsocketProtocol[],
  ) {
    super()
    this.url = new URL(url)
    this.controller = new AbortController()
    this.headers = extra_headers
    this.json = json

    // workaround for duplicate header problemA
    // SEE https://github.com/denoland/deno/issues/26866
    this.headers.set('X-User-Agent', '@mzm-cli/0.0.0')
    this.headers.set('User-Agent', '@mzm-cli/0.0.0')

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
    //console.log('closed: reconnecting')
    this.dispatchEvent(new CustomEvent('close', {detail: evt}))
    this.reconnect()
  }
  private onError(evt: ErrorEvent | Event) {
    console.log('error: %s reconnecting', (evt as ErrorEvent).message)
    this.reconnect()
  }
  private onMessage(evt: MessageEvent) {
    this.dispatchEvent(new CustomEvent('message', {detail: {data: evt.data, json: this.json}}))
  }
}
