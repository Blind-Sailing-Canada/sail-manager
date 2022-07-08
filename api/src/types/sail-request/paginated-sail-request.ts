import { SailRequest } from './sail-request';

export interface PaginatedSailRequest {
  count:number
  data: SailRequest[]
  page:number
  pageCount:number
  total:number
}
