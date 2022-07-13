import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Store,
} from '@ngrx/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { SailCategory } from '../../../../../../api/src/types/sail/sail-category';
import { createSailCategory, deleteSailCategory, fetchSailCategories } from '../../../store/actions/sail-category.actions';
import { STORE_SLICES } from '../../../store/store';

@Component({
  selector: 'app-admin-sail-category-page',
  templateUrl: './admin-sail-category-page.component.html',
  styleUrls: ['./admin-sail-category-page.component.scss']
})
export class AdminSailCategoryPageComponent extends BasePageComponent implements OnInit {

  public form: UntypedFormGroup;
  public sailCategories: SailCategory[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.buildForm();

    this.dispatchAction(fetchSailCategories({ notify: false }));

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_CATEGORIES, (categories) => {
      this.sailCategories = Object.values(categories || {});
    });
  }

  public saveSailCategory(): void {
    const newCategory = this.form.getRawValue() as Partial<SailCategory>;

    this.dispatchAction(createSailCategory({ category: newCategory }));

    this.form.reset();
  }

  public removeSailCategory(category: SailCategory): void {
    this.dispatchAction(deleteSailCategory({ sail_category_id: category.id }));
  }

  private buildForm(): void {
    this.form = this.fb.group({
      category: this.fb.control('', Validators.required),
    });

  }

}
