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
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
  fetchSail,
  updateSail,
} from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { SailorRole } from '../../../../../../api/src/types/sail-manifest/sailor-role';
import { Profile } from '../../../../../../api/src/types/profile/profile';

@Component({
  selector: 'app-sail-edit-page',
  templateUrl: './sail-edit-page.component.html',
  styleUrls: ['./sail-edit-page.component.css']
})
export class SailEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public availableBoats: Boat[] = [];
  public availableCrew: Profile[] = [];
  public availableMembers: Profile[] = [];
  public availableSkippers: Profile[] = [];
  public creatingNewSail = false;
  public sailEndDateTimeForm: FormGroup;
  public sailForm: FormGroup;
  public sailId: string;
  public sailRequestId: string;
  public sailStartDateTimeForm: FormGroup;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MomentService) private momentService: MomentService,
    @Inject(SailService) private sailsService: SailService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.sailRequestId = this.route.snapshot.params.sailRequestId;
    this.sailId = this.route.snapshot.params.id;
    this.creatingNewSail = !this.sailId;

    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      const sail = this.sails[this.sailId] || {} as Sail;
      const boatId = this.sailForm.controls.boatId.value || sail.boatId;
      this.updateMaxOccupancy(boatId);
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      if (!this.creatingNewSail) {
        const sail = this.sails[this.sailId];

        if (sail === undefined && !this._fetching[this.sailId]) {
          this._fetching[this.sailId] = true;
          this.dispatchAction(fetchSail({ id: this.sailId }));
          return;
        }

        if (!sail) {
          return;
        }

        this.updateForm(sail);

      }
    });

  }

  private updateForm(sail: Sail): void {
    const formValues = this.sailForm.getRawValue();

    this.sailForm.controls.name.setValue(formValues.name || sail.name);
    this.sailForm.controls.description.setValue(formValues.description || sail.description);

    const start = new Date(sail.start);

    this.sailStartDateTimeForm.patchValue({
      date: start.getDate(),
      hour: start.getHours(),
      minute: start.getMinutes(),
      month: start.getMonth(),
      year: start.getFullYear(),
    });

    const end = new Date(sail.end);

    this.sailStartDateTimeForm.patchValue({
      date: end.getDate(),
      hour: end.getHours(),
      minute: end.getMinutes(),
      month: end.getMonth(),
      year: end.getFullYear(),
    });

    this.sailForm.controls.boatId.setValue(formValues.boatId || sail.boatId);

    this.sailForm.markAsPristine();
  }

  private buildForm(): void {
    const currentDate = new Date();

    this.sailStartDateTimeForm = this.fb.group({
      date: new FormControl(currentDate.getDate(), Validators.required),
      month: new FormControl(currentDate.getMonth(), Validators.required),
      year: new FormControl(currentDate.getFullYear(), Validators.required),
      hour: new FormControl(currentDate.getHours(), Validators.required),
      minute: new FormControl(currentDate.getMinutes(), Validators.required),
    });

    this.sailStartDateTimeForm.valueChanges.subscribe((value) => {
      const startDateTime = this.buildDate(new Date(value.year, value.month, value.date), `${value.hour}:${value.minute}`);

      this.sailForm.controls.start.setValue(startDateTime);
      this.sailForm.controls.start.markAsDirty();
      this.sailForm.controls.start.updateValueAndValidity();

      const endDateTime =  new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 3);

      this.sailEndDateTimeForm.patchValue({
        date: endDateTime.getDate(),
        month: endDateTime.getMonth(),
        year: endDateTime.getFullYear(),
        hour: endDateTime.getHours(),
        minute: endDateTime.getMinutes()
      });

      this.sailEndDateTimeForm.markAsDirty();
      this.sailEndDateTimeForm.updateValueAndValidity();
    });

    this.sailEndDateTimeForm = this.fb.group({
      date: new FormControl(currentDate.getDate(), Validators.required),
      month: new FormControl(currentDate.getMonth(), Validators.required),
      year: new FormControl(currentDate.getFullYear(), Validators.required),
      hour: new FormControl(currentDate.getHours(), Validators.required),
      minute: new FormControl(currentDate.getMinutes(), Validators.required),
    });

    this.sailEndDateTimeForm.valueChanges.subscribe((value) => {
      const endDateTime = this.buildDate(new Date(value.year, value.month, value.date), `${value.hour}:${value.minute}`);
      this.sailForm.controls.end.setValue(endDateTime);
      this.sailForm.controls.end.markAsDirty();
      this.sailForm.controls.end.updateValueAndValidity();
    });

    this.sailForm = this.fb.group({
      name: new FormControl('', [
        (control) => {
          const name = control.value.trim();
          const valid = control.pristine || !!name;
          return valid ? null : { invalid: 'Sail name cannot be empty.' };
        },
        this.sailId ? Validators.required : null,
      ].filter(Boolean)),
      description: new FormControl({ disabled: !!this.sailRequestId, value: undefined }),
      start: new FormControl(undefined, [
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
          const end = this.sailForm.controls.end.value;

          if (!end) {
            return null;
          }

          const valid = !this.creatingNewSail || selectedDate.getTime() > now;
          return valid ? null : { 'Start date cannot be in the past!': control.value };
        },
      ]),
      end: new FormControl(undefined, [
        Validators.required,
        ((control) => {
          if (!this.sailForm) {
            return null;
          }
          if (!control.value) {
            return null;
          }
          const selectedDate = new Date(control.value);
          const start = this.sailForm.controls.start.value;
          const endTime = selectedDate.getTime();
          const startTime = start.getTime();
          const valid = endTime > startTime;

          return valid ? null : { 'End date must be greater than start date!': control.value };
        }).bind(this),
      ]),
      boatId: new FormControl(undefined, Validators.required),
      maxOccupancy: new FormControl(undefined, Validators.required),
    });

    this.sailForm
      .controls
      .boatId
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe(boatId => this.updateMaxOccupancy(boatId));

    this.fetchBoatsOnSailDateChanges();

    if (this.creatingNewSail) {
      const startMoment = new Date();

      startMoment.setDate(startMoment.getDate() + 1);

      const startDate = new Date(startMoment);

      this.sailStartDateTimeForm.controls.date.setValue(startDate.getDate());
      this.sailStartDateTimeForm.controls.month.setValue(startDate.getMonth());
      this.sailStartDateTimeForm.controls.year.setValue(startDate.getFullYear());
      this.sailStartDateTimeForm.controls.hour.setValue(startDate.getHours());
      this.sailStartDateTimeForm.controls.minute.setValue(startDate.getMinutes());

      startMoment.setHours(startMoment.getHours() + 3);

      const sailEnd = new Date(startMoment);

      this.sailEndDateTimeForm.controls.date.setValue(sailEnd.getDate());
      this.sailEndDateTimeForm.controls.month.setValue(sailEnd.getMonth());
      this.sailEndDateTimeForm.controls.year.setValue(sailEnd.getFullYear());
      this.sailEndDateTimeForm.controls.hour.setValue(sailEnd.getHours());
      this.sailEndDateTimeForm.controls.minute.setValue(sailEnd.getMinutes());
    }
  }

  public editManifest(): void {
    this.goTo([editSailManifestRoute(this.sailId)]);
  }

  private fetchBoatsOnSailDateChanges(): void {
    this.sailForm
      .controls
      .end
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
    const startDate: Date = this.sailForm.controls.start.value;
    const endDate: Date = this.sailForm.controls.end.value;
    return this.sailsService.fetchAvailableBoats(startDate.toISOString(), endDate.toISOString());
  }

  public setSailBoatOnKey(event, boatId: string): void {
    if (event.key !== 'Enter') {
      return;
    }

    this.setSailBoat(boatId);
  }

  public setSailBoat(id?: string): void {
    const currentlySetBoatId = this.sailForm.controls.boatId.value;

    if (currentlySetBoatId) {
      this.availableBoats = this.availableBoats.concat(this.getBoat(currentlySetBoatId));
    }

    this.availableBoats = this.availableBoats.filter(boat => boat.id !== id);

    this.sailForm.controls.boatId.setValue(id || null);
    this.sailForm.controls.boatId.markAsDirty();
    this.sailForm.controls.boatId.markAsTouched();
  }

  public get title(): string {
    return this.creatingNewSail ? 'New Sail Form' : 'Edit Sail Form';
  }

  private updateMaxOccupancy(boatId): void {
    const defaultMax = 6;
    const boat = this.getBoat(boatId) as Boat;

    if (!boat) {
      this.sailForm.controls.maxOccupancy.patchValue(undefined);
      return;
    }

    const boatMax = boat.maxOccupancy || defaultMax;

    this.sailForm.controls.maxOccupancy.patchValue(boatMax);
  }

  public get nameErrors(): string[] {
    const errors = this.sailForm.controls.name.errors || {};
    const errorKeys = Object.keys(errors);
    const errorStrings = errorKeys.map(key => `${key}: ${errors[key]}`);

    return errorStrings;
  }

  public get startDateErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.start.errors || {});
    return errors;
  }

  public get boatErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.boatId.errors || {});
    return errors;
  }

  public get maxOccupancyErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.maxOccupancy.errors || {});
    return errors;
  }

  public get endDateErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.end.errors || {});
    return errors;
  }

  public get maxOccupancy(): number {
    const boatId = this.sailForm.controls.boatId.value;
    const defaultValue = 6;
    const boatValue = (this.boats[boatId] || {} as Boat).maxOccupancy || defaultValue;

    const max = boatValue;

    return max;
  }

  public get maxPassengers(): number {
    const maxOccupancy = +this.sailForm.getRawValue().maxOccupancy;
    const maxPassengers = maxOccupancy - 2;
    return maxPassengers;
  }

  public get boatName(): string {
    const boatId = this.sailForm.controls.boatId.value;
    const boat = this.getBoat(boatId);
    return boat?.name;
  }

  public get skipperName(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sailId);
    return sail.manifest.find(sailor => sailor.sailorRole === SailorRole.Skipper)?.profile.name;
  }

  public get crewName(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sailId);
    return sail.manifest.find(sailor => sailor.sailorRole === SailorRole.Crew)?.profile.name;

  }

  public get passengerNames(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sailId);
    const passengers = sail
      .manifest
      .filter(sailor => sailor.sailorRole !== SailorRole.Skipper)
      .filter(sailor => sailor.sailorRole !== SailorRole.Crew)
      .map(sailor => sailor.personName);

    const names = passengers.join(', ');

    return names;
  }

  public getTime(type): string {
    if (!this.sailForm || !type) {
      return '';
    }
    const dateString = this.sailForm.controls[`${type}`].value as string;

    const formatedDateString = this.momentService.humanizeDateWithTime(dateString, false);
    return formatedDateString;
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

  private buildDate(date: Date, time: string) {
    const [hours, minutes] = (time || '0:0').split(':');
    const newDate = new Date(date);

    newDate.setHours(+hours);
    newDate.setMinutes(+minutes);
    newDate.setSeconds(0);

    return new Date(newDate);
  }

  public createSail(): void {
    const data = this.sailForm.getRawValue();

    const sail = this.copy(data) as Sail;

    if (this.sailRequestId) {
      this.dispatchAction(createSailFromSailRequest({ sail, sailRequestId: this.sailRequestId }));
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
    this.dispatchAction(updateSail({ id: this.sailId, sail: changedValue }));
  }

}
