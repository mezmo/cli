import type {RequestResponse} from '@anitrend/request-client'
import {default as client} from '../client.ts'
import type {View} from './types.ts'

export default {get, list}
export type {View}

interface IViewListResponse extends RequestResponse {
  data: Array<View>
}

export async function get(view_id: string, params: Record<string, string>): Promise<RequestResponse> {
  const res = await client.get(`/v1/config/view/${view_id}`, params)
  return res
}

export async function list(params?: Record<string, string>): Promise<IViewListResponse> {
  const res: IViewListResponse = await client.get('/v1/config/view', params)
  return res
}
