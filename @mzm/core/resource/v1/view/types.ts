import type {RequestResponse} from '@anitrend/request-client'
export type View = {
  category: Array<string>
, account: string
, name: string
, viewid: string
, query: string
, hosts?: Array<string>
, apps?: Array<string>
, tags?: Array<string>
, levels?: Array<string>
, presetids?: Array<string>
, presetid?: string
, description?: string
, channels?: Array<Record<string, object>>
, orgs: Array<object>
, pk?: string
}

export interface IViewListResponse extends RequestResponse {
  data: Array<View>
}

export interface IViewResponse extends RequestResponse {
  data: View
}

export type JoiDetail = {
  message: string
, key: string
}

export type JoiResponse = {
  details: Array<JoiDetail>
, error: string
, code: string
, status: string
}

