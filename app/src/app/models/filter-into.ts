import { PageEvent } from '@angular/material/paginator';

export interface FilterInfo {
  search: string;
  pagination: PageEvent;
  sort: string;
}
