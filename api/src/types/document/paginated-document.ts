import { Document } from './document';

export interface PaginatedDocument {
  count:number
  data: Document[]
  page:number
  pageCount:number
  total:number
}
