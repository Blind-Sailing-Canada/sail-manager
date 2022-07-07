import { Social } from './social';

export interface PaginatedSocial {
  count:number
  data: Social[]
  page:number
  pageCount:number
  total:number
}
