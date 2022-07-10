import { BoatMaintenance } from './boat-maintenance';

export interface PaginatedMaintenance {
  count:number
  data: BoatMaintenance[]
  page:number
  pageCount:number
  total:number
}
