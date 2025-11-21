import type {RequestResponse} from '@anitrend/request-client'

export interface IV3ListResponse<T> extends RequestResponse {
  meta: {
    pk: string | null
  , links: Record<string, Record<string, string>>
  , type: string
  }
  data: Array<T>
}
export interface IV3DetailResponse<T> extends RequestResponse {
  meta: {
    pk: string | null
  , links: Record<string, Record<string, string>>
  , type: string
  }
  data: T
}
