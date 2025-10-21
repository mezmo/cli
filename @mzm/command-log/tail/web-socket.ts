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
  constructor(
    url: string,
    protocols: WebsocketProtocol[],
    options: SocketOptions,
  ) {
    super()
    this.url = new URL(url)
    this.controller = new AbortController()

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
    console.log('establishing weboscket connection %s', this.url.toString())
    this.ws = new WebSocket(this.url.toString())
    this.ws.addEventListener('open', this.onOpen.bind(this))
    this.ws.addEventListener('close', this.onClose.bind(this))
    this.ws.addEventListener('error', this.onError.bind(this))
    this.ws.addEventListener('message', this.onMessage.bind(this))
  }

  close() {
    this.controller.abort()
    this.ws?.close?.()
    this.ws = null
  }

  private reconnect() {
    if (this.controller.signal.aborted) return
    if (this.ws) {
      this.ws.close()
      this.connected = false
    }

    setTimeout(() => {
      this.dispatchEvent(new Event('reconnecting'))
      this.open()
    }, 2000)
  }
  private onOpen() {
    this.connected = true
    this.dispatchEvent(new Event('open'))
  }
  private onClose(evt: CloseEvent) {
    this.dispatchEvent(new CustomEvent('close', {detail: evt}))
    this.reconnect()
  }
  private onError(evt: ErrorEvent | Event) {
    console.error(evt)
    this.reconnect()
  }
  private onMessage(evt: MessageEvent) {
    this.dispatchEvent(new CustomEvent('message', {detail: evt.data}))
  }
}
