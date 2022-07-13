export interface PaginatedData<T> {
  count: number;
  data: T[];
  page: number;
  pageCount: number;
  total: number;
}
