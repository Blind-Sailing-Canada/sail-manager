import { SailCategory } from '../../../../api/src/types/sail/sail-category';

export interface SailCategoryState {
  [categoryId: string]: SailCategory;
}
