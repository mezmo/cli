import {join, dirname, fromFileUrl} from '@std/path'
import {colors} from '@cliffy/ansi/colors'
import {default as client} from '../../client.ts'
import {AuthorizationError, CommunicationError, InputError, GenericError} from '../../../error.ts'
import type {RequestError} from '@anitrend/request-client'
import type {View, IViewListResponse, IViewResponse, JoiResponse} from './types.ts'
import ViewSpec from './spec.ts'

export default {get, list, create, getBySpec, remove, removeBySpec, update}
export {ViewSpec as Spec}
export type {View}

export async function get(view_id: string, params?: Record<string, string>): Promise<View | null> {
  try {
    const res = await client.get(`v1/config/view/${view_id}`, params)
    if (res.status === 200) {
      const view = res.data as View
      view.pk = view.viewid
      return view
    }
  } catch (err) {
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status
    if (err instanceof GenericError) throw err
    switch(status) {
      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }
      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read views in the appropriate account'
        , cast?.response?.data
        )
      }
      case 404: {
        // not really an "error"
        break
      }
      default: {
        throw err
      }
    }
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
  try {
    const res: IViewListResponse = await client.get('v1/config/view', params)
    for (const view of res.data) view.pk = view.viewid
    return res
  } catch (err) {
    if (err instanceof GenericError) throw err
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status

    switch (status) {
      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }
      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read views in the appropriate account'
        , cast?.response?.data
        )
      }
      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , {status: status, detail: cast?.response?.data}
        )
      }
    }
  }
}

export async function create(spec: ViewSpec): Promise<View> {
  try {
    const res: IViewResponse = await client.post('/v1/config/view', spec.toUpdate())
    res.data.pk = res.data.viewid
    return res.data as View
  } catch (err) {
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status
    if (err instanceof GenericError) throw err

    switch(status) {
      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }

      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read views in the appropriate account'
        , cast?.response?.data
        )
      }

      case 400: {
        throw InputError.from(
          `Make sure make sure your ${colors.bold(colors.yellow("view"))} spec file includes all of the required fields and that they are in the correct format.`
        , (cast?.response?.data as JoiResponse)?.details
        )
      }

      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , {status: status, detail: cast?.response?.data}
        )
      }
    }

  }
}

export async function remove(view_id: string): Promise<void> {
  try {
    const res = await client.delete(`v1/config/view/${view_id}`)
    if (res.status === 200) return
  } catch (err) {
    if (err instanceof GenericError) throw err
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status
    switch(status) {
      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }

      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read views in the appropriate account'
        , cast?.response?.data
        )
      }

      case 404: {
        // nothing to do here
        break
      }

      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , {status: status, detail: cast?.response?.data}
        )
      }
    }
  }
}

export async function update(spec: ViewSpec): Promise<View> {

  const update = spec.toUpdate()

  try {
    const res = await client.put(`v1/config/view/${spec.pk}`, update)
    const view = res.data as View
    view.pk = view.viewid
    return view
  } catch (err) {
    if (err instanceof GenericError) throw err
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status

    switch(status) {
      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }

      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read categories in the appropriate account'
        , cast?.response?.data
        )
      }

      case 400: {
        throw InputError.from(
          `Make sure make sure your ${colors.bold(colors.yellow("category"))} spec file includes all of the required fields and that they are in the correct format.`
        , (cast?.response?.data as JoiResponse)?.details
        )
      }

      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , {status: status, detail: cast?.response?.data}
        )
      }
    }
  }
}

export function template(): Promise<string> {
  const current_directory = dirname(fromFileUrl(import.meta.url))
  const template_location = join(current_directory, 'template.yaml')
  return Deno.readTextFile(template_location)
}

export async function removeBySpec(view: View): Promise<void> {
  view.pk = view.viewid
  return await remove(view.viewid)
}

