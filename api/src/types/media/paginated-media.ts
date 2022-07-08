import { Media } from './media';

export interface PaginatedMedia {
  count: number;
  data: Media[];
  page: number;
  pageCount: number;
  total: number;
}
