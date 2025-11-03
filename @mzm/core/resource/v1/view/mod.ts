import type {RequestError} from '@anitrend/request-client'
import {default as client} from '../../client.ts'
import type {View, IViewListResponse, IViewResponse} from './types.ts'
export default {get, list, create, getBySpec, remove, removeBySpec, update}

export type {View}


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
    view.pk = view.viewid
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
  for (const view of res.data) view.pk = view.viewid
  return res
}

export async function create(params?: View): Promise<View> {
  const res: IViewResponse = await client.post('/v1/config/view', params)
  res.data.pk = res.data.viewid
  return res.data as View
}

export async function remove(view_id: string): Promise<void> {
  try {
    const res = await client.delete(`v1/config/view/${view_id}`)
    if (res.status === 200) return
  } catch (err) {
    if ((err as RequestError)?.response?.status !== 404) throw err
  }
}

export async function update(view: View): Promise<View> {
  const {account: _account, viewid: _viewid, orgs: _orgs, presetids = [], ...update} = view

  if (presetids.length) update.presetid = presetids[0]
  try {
    const res = await client.put(`v1/config/view/${view.viewid}`, update)
    return res.data as View
  } catch (err) {
    console.dir(err)
    throw err
  }
}

export async function removeBySpec(view: View): Promise<void> {
  view.pk = view.viewid
  return await remove(view.viewid)
}

