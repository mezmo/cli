import {debuglog} from 'node:util'
import {colors} from '@mzm/core'
import {toArray} from '@mzm/core/lang'
import {toTitleCase} from '@std/text/unstable-to-title-case'
import {Select} from '@cliffy/prompt/select'
import {default as client} from '../../client.ts'
import {AuthorizationError, CommunicationError, InputError, GenericError, ClientError} from '../../../error.ts'
import {type Category , CATEGORY, type JoiResponse, type ICategoryDetailResponse} from './types.ts'
import type {RequestError} from '@anitrend/request-client'
import CategorySpec from './spec.ts'
import category_template from './template.yaml' with {type: 'text'}

export {CategorySpec as Spec}

const debug = debuglog('core:resource:category')

const DEFAULT_CATEGORY = [CATEGORY.BOARD, CATEGORY.SCREEN, CATEGORY.VIEW]

type ErrorResponse = {
  code: string
, error: string
, status: string
}

export async function create(spec: CategorySpec): Promise<Category> {

  const params = spec.toCreate()
  try {
    const uri = `v1/config/categories/${spec.type}`
    debug('POST %s', uri)
    const res: ICategoryDetailResponse = await client.post(uri, params)
    const category = res.data as Category
    category.pk = category.id
    debug('%o', res.data)
    return category
  } catch (err) {
    debug('%o', err)
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status
    if (err instanceof GenericError) throw err

    switch(status) {
      case 400: {
        throw InputError.from(
          `Make sure your ${colors.bold(colors.yellow("category"))} includes all of the required fields and that they are in the correct format.`
        , (cast?.response?.data as JoiResponse)?.details
        )
      }

      case 401: {
        throw AuthorizationError.from(
          'There was a problem authenticating the previous operation. Make sure your access key is still valid'
        , cast?.response?.data
        )
      }

      case 403: {
        throw AuthorizationError.from(
          `Make sure you have the appropriate permissions to create a ${colors.yellow("category")} in the appropriate account`
        , cast?.response?.data
        )
      }

      case 409: {
        throw CommunicationError.from(
          `A ${colors.yellow("category")} with the same name already exists`
        , {status, detail: cast?.response?.data}
        )
      }

      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , {status, detail: cast?.response?.data}
        )
      }
    }
  }
}

export async function get(pk: string, params?: Record<string, string>): Promise<Category | null> {
  const types = params?.type ? toArray(params?.type) : DEFAULT_CATEGORY
  try {
    const results = await Promise.allSettled(
      types.map((type) => {
        const uri = `v1/config/categories/${type}/${pk}`
        debug('GET %s', uri)
        return client.get(uri, params)
      })
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const cat = result.value.data as Category
        cat.pk = cat.id
        return cat
      }

      const status = result.reason.response.status
      const res = result.reason.response.data as ErrorResponse
      const error_code = res?.code ?? 'InternalError'
      const error = res?.error ?? ''

      switch (status) {
        case 401: {
          throw AuthorizationError.from(
            'There was a problem authenticating the previous operation. Make sure your access key is still valid'
          , res.error
          )
        }
        case 403: {
          throw AuthorizationError.from(
            'Make sure you have the appropriate permissions to read categories in the appropriate account'
          , res.error
          )
        }
        case 404: {
          // not really an "error"
          break
        }

        // this endpoint typically returns a 400 :|
        // for authorization errors
        case 400: {
          if ((/notauthorized/i).test(error_code)) throw AuthorizationError.from(
            'There was a problem authenticating the previous operation. Make sure your access key is still valid'
          , {status, error_code, error}
          )

          throw InputError.from(
            `Make sure your ${colors.bold(colors.yellow("category"))} spec file includes all of the required fields and that they are in the correct format.`
          , (res as JoiResponse).details
          )
        }
        default: {
          throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
          , {status, details:{code: res.code, error: res.error}}
          )
        }
      }
    }

    const cats = await list(params)
    const to_match = pk.toLowerCase()
  
    debug('could not find id %s - checking all names', to_match)
    for (const cat of cats) {
      cat.pk = cat.id
      if (cat.pk === to_match) return cat
      const name = cat.name.toLowerCase()
      if (name === to_match) return cat
    }
    return null
  } catch (err) {
    debug('%o', err)
    const cast: RequestError = err as RequestError
    const res = cast?.response?.data as ErrorResponse
    const status = res?.status || 500

    throw CommunicationError.from(
      'Try again in a few minutes. If the problem persists, please contact customer support.'
    , {status, detail: res}
    )
  }
}

export async function list(params?: Record<string, string>): Promise<Array<Category>> {
  const types = params?.type ? toArray(params?.type) : DEFAULT_CATEGORY
  const output: Array<Category> = []
  try {
    const results = await Promise.all(
      types.map((type) => {
        const uri = `v1/config/categories/${type}`
        debug('GET %s', uri)
        return client.get(uri)
      })
    )
    for (const response of results) {
      for (const category of response.data as Array<Category>) {
        category.pk = category.id
        output.push(category)
      }
    }
  } catch (err) {
    debug('%o', err)
    if (err instanceof GenericError) throw err
    const cast: RequestError = err as RequestError
    const status = cast?.response?.status
    const error_code = (cast?.response?.data as ErrorResponse)?.code

    if (status === 401 || (/notauthorized/i).test(error_code)) throw AuthorizationError.from(
      'There was a problem authenticating the previous operation. Make sure your access key is still valid'
    , cast?.response?.data
    )

    switch(status) {
      case 403: {
        throw AuthorizationError.from(
          'Make sure you have the appropriate permissions to read categories in the appropriate account'
        , {status, detail: cast?.response?.data}
        )
      }
      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , {status, detail: cast?.response?.data}
        )
      }
    }
  }

  return output
}

export async function prompt(): Promise<Category|void> {
  const cats = await list()
  if (!list.length) return
  const categories = new Map()
  for (const cat of cats) {
    const category_name = cat.type
    const category = categories.get(category_name) ?? {
      name: toTitleCase(category_name)
    , options: [
      ]
    }

    category.options.push({name: cat.name.trim(), value: cat})
    categories.set(category_name, category)
  }

  const category = await Select.prompt({
    message: 'Select A Category'
  , groupIcon: '\u00BB '
  , groupOpenIcon: '\u00AB '
  , maxRows: 20
  , options: Array.from(categories.values()).sort((a, b) => {
      if (a.name > b.name) return 1
      if (a.name < b.name) return -1
      return 0
    })
  })
  return category as Category
}

export async function remove(pk: string): Promise<string | void> {
  const category: Category | null = await get(pk)
  if (!category) throw CommunicationError.from(
    `Unable to find ${colors.yellow('catagory')} '${colors.bold(pk)}'`
  , {status: 404, detail: {code: 'ENOENT', status: 404, message: 'Not found'}}
  )

  const uri = `v1/config/categories/${category.type}/${category.pk}`
  debug('DELETE %s', uri)
  await client.delete(uri)
  return category.id
}

export async function removeBySpec(category: Category): Promise<string | void> {
  category.pk = category.id
  return await remove(category.pk)
}

export async function update(spec: CategorySpec): Promise<Category> {
  const update = spec.toUpdate()
  try {
    const uri = `v1/config/categories/${spec.type}/${spec.pk}`
    debug('PUT %s', uri)
    const res = await client.put(uri, update)
    return res.data as Category
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

      case 409: {
        throw ClientError.from(
          `A ${colors.yellow("category")} with the same name already exists`
        , cast?.response?.data
        )
      }

      default: {
        throw CommunicationError.from(
          'Try again in a few minutes. If the problem persists, please contact customer support.'
        , cast?.response?.data
        )
      }
    }
  }
}

export function template(): string {
  return category_template
}


export async function getBySpec(spec: Category):Promise<Category | null> {
  return await get(spec.name, {type: spec.type})
}
