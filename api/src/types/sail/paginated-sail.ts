import { Sail } from './sail';

export interface PaginatedSail {
  count:number
  data: Sail[]
  page:number
  pageCount:number
  total:number
}
