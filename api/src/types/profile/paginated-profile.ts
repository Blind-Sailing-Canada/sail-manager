import { Profile } from './profile';

export interface PaginatedProfile {
  count:number
  data: Profile[]
  page:number
  pageCount:number
  total:number
}
