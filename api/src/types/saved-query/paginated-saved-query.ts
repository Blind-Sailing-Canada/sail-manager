import { SavedQuery } from './saved-query';

export interface PaginatedSavedQuery {
  count: number
  data: SavedQuery[]
  page: number
  pageCount: number
  total: number
}
