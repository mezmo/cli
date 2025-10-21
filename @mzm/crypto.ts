import {crypto} from '@std/crypto'
import {encodeHex} from '@std/encoding'

export {genHMAC}

async function genHMAC(secret: string, msg: string) {
  const encoder = new TextEncoder()
  const key_material = encoder.encode(secret)
  const data = encoder.encode(msg)

  const algorithm = {
    name: 'HMAC',
    hash: 'SHA-256',
  }

  const key = await crypto.subtle.importKey(
    'raw',
    key_material,
    algorithm,
    false, // not extractable
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    algorithm.name,
    key,
    data,
  )
  return encodeHex(signature)
}
