import type {RequestResponse} from '@anitrend/request-client'
export enum CATEGORY {
  VIEW = 'views'
, BOARD = 'boards'
, SCREEN = 'screens'
}

export type Category = {
  name: string
, type: CATEGORY
, id: string
, pk?: string
}

export interface ICategoryDetailResponse extends RequestResponse {
  data: Category
}

export interface ICategoryListResponse extends RequestResponse {
  data: Array<Category>
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
