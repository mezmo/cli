import type {Account} from '../account/types.ts'

export type Enterprise = {
  enterprise_id: string
, name: string
, status: string
, parent_enterprise_id?: string
, partner?: string
, accounts: Array<Account>
}
