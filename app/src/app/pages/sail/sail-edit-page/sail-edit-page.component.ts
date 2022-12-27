import {
  interval,
  Observable,
} from 'rxjs';
import {
  debounce,
  distinctUntilChanged,
  switchMap,
  takeWhile,
} from 'rxjs/operators';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';

import {
  editSailManifestRoute,
} from '../../../routes/routes';
import { MomentService } from '../../../services/moment.service';
import { SailService } from '../../../services/sail.service';
import { putBoats } from '../../../store/actions/boat.actions';
import {
  createSail,
  createSailFromSailRequest,
  updateSail,
} from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { SailorRole } from '../../../../../../api/src/types/sail-manifest/sailor-role';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { SailCategory } from '../../../../../../api/src/types/sail/sail-category';
import { fetchSailCategories } from '../../../store/actions/sail-category.actions';
import { BoatStatus } from '../../../../../../api/src/types/boat/boat-status';

@Component({
  selector: 'app-sail-edit-page',
  templateUrl: './sail-edit-page.component.html',
  styleUrls: ['./sail-edit-page.component.scss']
})
export class SailEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public availableBoats: Boat[] = [];
  public availableCrew: Profile[] = [];
  public availableMembers: Profile[] = [];
  public availableSkippers: Profile[] = [];
  public creatingNewSail = false;
  public sailEndDateTimeForm: UntypedFormGroup;
  public sailForm: UntypedFormGroup;
  public sail_id: string;
  public sail_request_id: string;
  public sailStartDateTimeForm: UntypedFormGroup;
  public sailCategories: SailCategory[] = [];
  public totalFormSteps = 11;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(MomentService) private momentService: MomentService,
    @Inject(SailService) private sailsService: SailService,
    private changeDetector: ChangeDetectorRef,
  ) {
    super(store, route, router);
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.sail_request_id = this.route.snapshot.params.sail_request_id;
    this.sail_id = this.route.snapshot.params.id;
    this.creatingNewSail = !this.sail_id;

    this.dispatchAction(fetchSailCategories({ notify: false }));

    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_CATEGORIES, (categories) => {
      this.sailCategories = Object.values(categories || {});
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      const sail = this.sails[this.sail_id] || {} as Sail;
      const boat_id = this.sailForm.controls.boat_id.value || sail.boat_id;
      this.updateMaxOccupancy(boat_id);
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      let sail: Sail;

      if (!this.creatingNewSail) {
        if (Number.isInteger(+this.sail_id)) {
          sail = this.getSailByNumber(+this.sail_id);
        } else {
          sail = this.getSail(this.sail_id);
        }

        if (!sail) {
          return;
        }

        this.sail_id = sail.id;
        this.updateForm(sail);

      }
    });

  }

  public editManifest(): void {
    this.goTo([editSailManifestRoute(this.sail_id)]);
  }

  public setSailBoatOnKey(event, boat_id: string): void {
    if (event.key !== 'Enter') {
      return;
    }

    this.setSailBoat(boat_id);
  }

  public setSailBoat(id?: string): void {
    const currentlySetBoatId = this.sailForm.controls.boat_id.value;

    if (currentlySetBoatId) {
      this.availableBoats = this.availableBoats.concat(this.getBoat(currentlySetBoatId));
    }

    this.availableBoats = this.availableBoats.filter(boat => boat.id !== id);

    this.sailForm.controls.boat_id.setValue(id || null);
    this.sailForm.controls.boat_id.markAsDirty();
    this.sailForm.controls.boat_id.markAsTouched();
  }

  public get title(): string {
    return this.creatingNewSail ? 'New Sail Form' : 'Edit Sail Form';
  }

  public get nameErrors(): string[] {
    const errors = this.sailForm.controls.name.errors || {};
    const errorKeys = Object.keys(errors);
    const errorStrings = errorKeys.map(key => `${key}: ${errors[key]}`);

    return errorStrings;
  }

  public get start_dateErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.start_at.errors || {});
    return errors;
  }

  public get boatErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.boat_id.errors || {});
    return errors;
  }

  public get max_occupancyErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.max_occupancy.errors || {});
    return errors;
  }

  public get end_dateErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.end_at.errors || {});
    return errors;
  }

  public get max_occupancy(): number {
    const boat_id = this.sailForm.controls.boat_id.value;
    const defaultValue = 6;
    const boatValue = (this.boats[boat_id] || {} as Boat).max_occupancy || defaultValue;

    const max = boatValue;

    return max;
  }

  public get boatName(): string {
    const boat_id = this.sailForm.controls.boat_id.value;
    const boat = this.getBoat(boat_id);
    return boat?.name;
  }

  public boatNotInServiceWarning(boatId?: string): string {
    const boat_id = boatId ?? this.sailForm.controls.boat_id.value;
    const boat = this.getBoat(boat_id);
    return boat?.status !== BoatStatus.InService? 'Warning: this boat is not in service' : '';
  }

  public get skipperName(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sail_id);

    return sail?.manifest
      .filter(sailor => sailor.sailor_role === SailorRole.Skipper)
      .map((sailor) => sailor.profile?.name || sailor.person_name)
      .join(', ');
  }

  public get crewName(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sail_id);
    return sail?.manifest
      .filter(sailor => sailor.sailor_role === SailorRole.Crew)
      .map(sailor => sailor.profile?.name || sailor.person_name)
      .join(', ');

  }

  public get sailorNames(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sail_id);
    const sailors = sail
      .manifest
      .filter(sailor => sailor.sailor_role !== SailorRole.Skipper)
      .filter(sailor => sailor.sailor_role !== SailorRole.Crew)
      .map(sailor => sailor.person_name);

    const names = sailors.join(', ');

    return names;
  }

  public getTime(type): string {
    if (!this.sailForm || !type) {
      return '';
    }
    const dateString = this.sailForm.controls[`${type}`].value as string;

    const formattedDateString = this.momentService.humanizeDateWithTime(dateString, false);
    return formattedDateString;
  }

  public get shouldEnableUpdateButton(): boolean {
    const isFormValid = this.sailForm.valid;
    const isFormDirty = this.sailForm.dirty;
    const should = !this.creatingNewSail && isFormValid && isFormDirty;

    return should;
  }

  public get shouldEnableCreateButton(): boolean {
    const isFormValid = this.sailForm.valid;
    const isFormDirty = this.sailForm.dirty;
    const should = this.creatingNewSail && isFormValid && isFormDirty;

    return should;
  }

  public createSail(): void {
    const data = this.sailForm.getRawValue();

    const sail = this.copy(data) as Sail;

    if (this.sail_request_id) {
      this.dispatchAction(createSailFromSailRequest({ sail, sail_request_id: this.sail_request_id }));
    } else {
      this.dispatchAction(createSail({ sail }));
    }
  }

  public updateSail(): void {
    const formControls = this.sailForm.controls;
    const formKeys = Object.keys(formControls);
    const changedValue = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          red[key] = formControls[key].value ? formControls[key].value : null;
          return red;
        },
        {}
      ) as any;

    this.sailForm.markAsPristine();
    this.sailForm.markAsUntouched();
    this.dispatchAction(updateSail({ id: this.sail_id, sail: changedValue }));
  }

  private fetchBoatsOnSailDateChanges(): void {
    this.sailForm
      .controls
      .end_at
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
        debounce(() => interval(1000)),
        distinctUntilChanged(),
        switchMap(() => this.fetchAvailableBoats()),
      )
      .subscribe(
        (boats) => {
          this.availableBoats = boats;
          this.dispatchAction(putBoats({ boats }));
        },
        error => console.error(error)
      );
  }

  private fetchAvailableBoats(): Observable<Boat[]> {
    const start_date: Date = this.sailForm.controls.start_at.value;
    const end_date: Date = this.sailForm.controls.end_at.value;
    return this.sailsService.fetchAvailableBoats(start_date.toISOString(), end_date.toISOString());
  }

  private updateMaxOccupancy(boat_id): void {
    const defaultMax = 6;
    const boat = this.getBoat(boat_id) as Boat;

    if (!boat) {
      this.sailForm.controls.max_occupancy.patchValue(undefined);
      return;
    }

    const boatMax = boat.max_occupancy || defaultMax;

    this.sailForm.controls.max_occupancy.patchValue(boatMax);
  }

  private buildDate(date: Date, time: string) {
    const [hours, minutes] = (time || '0:0').split(':');
    const newDate = new Date(date);

    newDate.setHours(+hours);
    newDate.setMinutes(+minutes);
    newDate.setSeconds(0);

    return new Date(newDate);
  }

  private updateForm(sail: Sail): void {

    const formValues = this.sailForm.getRawValue();

    this.sailForm.controls.category.setValue(sail.category);
    this.sailForm.controls.name.setValue(sail.name);
    this.sailForm.controls.description.setValue(sail.description);
    this.sailForm.controls.is_payment_free.setValue(sail.is_payment_free);

    const start = new Date(sail.start_at);

    this.sailStartDateTimeForm.patchValue({
      date: start.getDate(),
      hour: start.getHours(),
      minute: start.getMinutes(),
      month: start.getMonth(),
      year: start.getFullYear(),
    });

    const end = new Date(sail.end_at);

    this.sailEndDateTimeForm.patchValue({
      date: end.getDate(),
      hour: end.getHours(),
      minute: end.getMinutes(),
      month: end.getMonth(),
      year: end.getFullYear(),
    });

    this.sailForm.controls.boat_id.setValue(formValues.boat_id || sail.boat_id);

    this.sailForm.markAsPristine();
  }

  private buildForm(): void {
    const currentDate = new Date();

    this.sailStartDateTimeForm = this.fb.group({
      date: new UntypedFormControl(currentDate.getDate(), Validators.required),
      month: new UntypedFormControl(currentDate.getMonth(), Validators.required),
      year: new UntypedFormControl(currentDate.getFullYear(), Validators.required),
      hour: new UntypedFormControl(currentDate.getHours(), Validators.required),
      minute: new UntypedFormControl(currentDate.getMinutes(), Validators.required),
    });

    this.sailStartDateTimeForm.valueChanges.subscribe((value) => {
      const start_date_time = this.buildDate(new Date(value.year, value.month, value.date), `${value.hour}:${value.minute}`);

      this.sailForm.controls.start_at.setValue(start_date_time);
      this.sailForm.controls.start_at.markAsDirty();
      this.sailForm.controls.start_at.updateValueAndValidity();

      const end_date_time = new Date(start_date_time);
      end_date_time.setHours(end_date_time.getHours() + 3);

      this.sailEndDateTimeForm.patchValue({
        date: end_date_time.getDate(),
        month: end_date_time.getMonth(),
        year: end_date_time.getFullYear(),
        hour: end_date_time.getHours(),
        minute: end_date_time.getMinutes()
      });

      this.sailEndDateTimeForm.markAsDirty();
      this.sailEndDateTimeForm.updateValueAndValidity();
    });

    this.sailEndDateTimeForm = this.fb.group({
      date: new UntypedFormControl(currentDate.getDate(), Validators.required),
      month: new UntypedFormControl(currentDate.getMonth(), Validators.required),
      year: new UntypedFormControl(currentDate.getFullYear(), Validators.required),
      hour: new UntypedFormControl(currentDate.getHours(), Validators.required),
      minute: new UntypedFormControl(currentDate.getMinutes(), Validators.required),
    });

    this.sailEndDateTimeForm.valueChanges.subscribe((value) => {
      const end_date_time = this.buildDate(new Date(value.year, value.month, value.date), `${value.hour}:${value.minute}`);
      this.sailForm.controls.end_at.setValue(end_date_time);
      this.sailForm.controls.end_at.markAsDirty();
      this.sailForm.controls.end_at.updateValueAndValidity();
    });

    this.sailForm = this.fb.group({
      category: this.fb.control(''),
      is_payment_free: this.fb.control(false),
      name: new UntypedFormControl('', [
        (control) => {
          const name = control.value.trim();
          const valid = control.pristine || !!name;
          return valid ? null : { invalid: 'Sail name cannot be empty.' };
        },
        this.sail_id ? Validators.required : null,
      ].filter(Boolean)),
      description: new UntypedFormControl({ disabled: !!this.sail_request_id, value: undefined }),
      start_at: new UntypedFormControl(undefined, [
        Validators.required,
        (control) => {
          if (!this.sailForm) {
            return null;
          }

          if (!control.value) {
            return null;
          }

          const selectedDate = new Date(control.value);
          const now = Date.now();
          const end = this.sailForm.controls.end_at.value;

          if (!end) {
            return null;
          }

          const valid = !this.creatingNewSail || selectedDate.getTime() > now;
          return valid ? null : { 'Start date cannot be in the past!': control.value };
        },
      ]),
      end_at: new UntypedFormControl(undefined, [
        Validators.required,
        ((control) => {
          if (!this.sailForm) {
            return null;
          }
          if (!control.value) {
            return null;
          }
          const selectedDate = new Date(control.value);
          const start = this.sailForm.controls.start_at.value;
          const endTime = selectedDate.getTime();
          const startTime = start.getTime();
          const valid = endTime > startTime;

          return valid ? null : { 'End date must be greater than start date!': control.value };
        }).bind(this),
      ]),
      boat_id: new UntypedFormControl(undefined, Validators.required),
      max_occupancy: new UntypedFormControl(undefined, Validators.required),
    });

    this.sailForm
      .controls
      .boat_id
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe(boat_id => this.updateMaxOccupancy(boat_id));

    this.fetchBoatsOnSailDateChanges();

    if (this.creatingNewSail) {
      const startMoment = new Date();

      startMoment.setDate(startMoment.getDate() + 1);

      const start_date = new Date(startMoment);

      this.sailStartDateTimeForm.controls.date.setValue(start_date.getDate());
      this.sailStartDateTimeForm.controls.month.setValue(start_date.getMonth());
      this.sailStartDateTimeForm.controls.year.setValue(start_date.getFullYear());
      this.sailStartDateTimeForm.controls.hour.setValue(start_date.getHours());
      this.sailStartDateTimeForm.controls.minute.setValue(start_date.getMinutes());

      startMoment.setHours(startMoment.getHours() + 3);

      const sailEnd = new Date(startMoment);

      this.sailEndDateTimeForm.controls.date.setValue(sailEnd.getDate());
      this.sailEndDateTimeForm.controls.month.setValue(sailEnd.getMonth());
      this.sailEndDateTimeForm.controls.year.setValue(sailEnd.getFullYear());
      this.sailEndDateTimeForm.controls.hour.setValue(sailEnd.getHours());
      this.sailEndDateTimeForm.controls.minute.setValue(sailEnd.getMinutes());
    }
  }

}
