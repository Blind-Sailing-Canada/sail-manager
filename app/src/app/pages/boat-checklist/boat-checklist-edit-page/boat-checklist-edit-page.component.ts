import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { BoatChecklistItem } from '../../../../../../api/src/types/boat-checklist/boat-checklist-item';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { BoatChecklistItemType } from '../../../../../../api/src/types/boat-checklist/boat-checklist-item-type';
import { BoatChecklistService } from '../../../services/boat-checklist.service';
import { take } from 'rxjs';
import { finishLoading, startLoading } from '../../../store/actions/app.actions';

@Component({
  selector: 'app-boat-checklist-edit-page',
  templateUrl: './boat-checklist-edit-page.component.html',
  styleUrls: ['./boat-checklist-edit-page.component.css']
})
export class BoatChecklistEditPageComponent extends BasePageComponent implements OnInit {

  public form: UntypedFormGroup;
  public BoatChecklistItemType = BoatChecklistItemType;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(Router) router: Router,
    @Inject(BoatChecklistService) private boatChecklistService: BoatChecklistService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      const boat = this.boat;
      if (boat) {
        this.updateForm();
      }
    });

  }

  public save(): void {
    const formData: any = this.formItems.value;

    this.dispatchAction(startLoading());

    if (this.boat.checklist?.id) {
      this.boatChecklistService.update(this.boat.checklist.id, {
        items: formData,
      }).pipe(take(1)).subscribe((checklist) => {
        this.dispatchAction(finishLoading());
        this.fetchBoat(this.boat_id);
      });
    } else {
      this.boatChecklistService.create({
        boatId: this.boat_id,
        items: formData,
      }).pipe(take(1)).subscribe((checklist) => {
        this.dispatchAction(finishLoading());
        this.fetchBoat(this.boat_id);
      });
    }
  }

  public get title(): string {
    return this.boat_id ? 'Edit Boat Checklist Form' : 'New Boat Checklist Form';
  }

  public get boat(): Boat {
    if (!this.boat_id) {
      return;
    }
    const boat = this.boats[this.boat_id];
    if (!boat && boat !== null) {
      this.fetchBoat(this.boat_id);
    }

    return boat;
  }

  public get formItems(): UntypedFormArray {
    return this.form.controls.items as UntypedFormArray;
  }

  public asFormGroup(item: AbstractControl): UntypedFormGroup {
    return item as UntypedFormGroup;
  }

  public deleteItem(index: number): void {
    this.formItems.removeAt(index);
  }

  public addSelectItem(item?: BoatChecklistItem): void {
    this.formItems.push(this.fb.group({
      defaultValue: this.fb.control(item?.defaultValue),
      key: this.fb.control(item?.key, Validators.required),
      label: this.fb.control(item?.label || null, Validators.required),
      type: this.fb.control(BoatChecklistItemType.Select),
      options: this.fb.control(item?.options, Validators.required)
    }));
  }

  public addInputItem(item?: BoatChecklistItem): void {
    this.formItems.push(this.fb.group({
      defaultValue: this.fb.control(item?.defaultValue),
      key: this.fb.control(item?.key, Validators.required),
      label: this.fb.control(item?.label || null, Validators.required),
      type: this.fb.control(BoatChecklistItemType.Input),
      options: this.fb.control([])
    }));
  }

  public get boat_id(): string {
    return this.route.snapshot.params.id;
  }

  public get isFormDirty(): boolean {
    const isDirty: boolean = Object
      .keys(this.form.controls)
      .some(control => this.form.controls[control].dirty);

    return isDirty;
  }

  public get shouldDisableUpdateButton(): boolean {
    const should = !this.form || !this.isFormDirty || !this.form.valid;
    return !!should;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      items: this.fb.array([])
    });
  }

  private updateForm(): void {
    this.form = this.fb.group({
      items: this.fb.array([])
    });

    (this.boat.checklist?.items || []).forEach((item) => {
      switch(item.type) {
        case BoatChecklistItemType.Input:
          this.addInputItem(item);
          break;
        case BoatChecklistItemType.Select:
          this.addSelectItem(item);
          break;
        default:
          throw new Error(`Unknown BoatChecklistItemType ${item.type}`);
      }
    });

    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

}
