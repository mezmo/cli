import type {RequestResponse, RequestError} from '@anitrend/request-client'
import {default as client} from '../../client.ts'
import type {View} from './types.ts'
export default {get, list, create, getBySpec, remove, removeBySpec}

export type {View}

interface IViewListResponse extends RequestResponse {
  data: Array<View>
}

interface IViewResponse extends RequestResponse {
  data: View
}

export async function get(view_id: string, params?: Record<string, string>): Promise<View | null> {
  try {
    const res = await client.get(`v1/config/view/${view_id}`, params)
    if (res.status === 200) return res.data as View
  } catch (err) {
    if ((err as RequestError)?.response?.status !== 404) throw err
  }
  const views = await list(params)
  const to_match = view_id.toLowerCase()
  for (const view of views.data) {
    if (view.viewid === view_id) return view
    const name = view.name.toLowerCase()
    if (name === to_match) return view
  }
  return null
}

export async function getBySpec(spec: View):Promise<View | null> {
  return await get(spec.name)
}

export async function list(params?: Record<string, string>): Promise<IViewListResponse> {
  const res: IViewListResponse = await client.get('v1/config/view', params)
  return res
}

export async function create(params?: View): Promise<IViewResponse> {
  const res: IViewResponse = await client.post('/v1/config/view', params)
  return res
}

export async function remove(view_id: string): Promise<void> {
  try {
    console.log('delete view %s', view_id)
    const res = await client.delete(`v1/config/view/${view_id}`)
    if (res.status === 200) return
  } catch (err) {
    if ((err as RequestError)?.response?.status !== 404) throw err
  }

}

export async function removeBySpec(view: View): Promise<void> {
    console.log('remove by spec view %s', view.viewid)
  return await remove(view.viewid)
}

