import {
  Component,
  Inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-sail-checklist-edit-page',
  templateUrl: './sail-checklist-edit-page.component.html',
  styleUrls: ['./sail-checklist-edit-page.component.css']
})
export class SailChecklistEditPageComponent extends SailChecklistBasePageComponent {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) fb: FormBuilder,
  ) {
    super(store, route, router, fb);

    this.checklist_type = SailChecklistType.Both;

    if (fb) {
      this.buildForm();
    }
  }

}
