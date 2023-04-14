import {
  AfterViewInit,
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
  editSocialManifestRoute,
} from '../../../routes/routes';
import { MomentService } from '../../../services/moment.service';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { createSocial, updateSocial } from '../../../store/actions/social.actions';
import { Social } from '../../../../../../api/src/types/social/social';

@Component({
  selector: 'app-social-edit-page',
  templateUrl: './social-edit-page.component.html',
  styleUrls: ['./social-edit-page.component.scss']
})
export class SocialEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public creatingNewSocial = false;
  public socialForm: UntypedFormGroup;
  public socialEndDateTimeForm: UntypedFormGroup;
  public socialStartDateTimeForm: UntypedFormGroup;
  public social_id: string;
  public totalFormSteps = 5;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(MomentService) private momentService: MomentService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.social_id = this.route.snapshot.params.id;
    this.creatingNewSocial = !this.social_id;

    this.buildForm();
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SOCIALS, () => {
      if (this.creatingNewSocial) {
        return;
      }

      const social = this.socials[this.social_id];


      if (!social) {
        this.fetchSocial(this.social_id);
        return;
      }

      this.updateForm(social);
    });

  }

  public editManifest(): void {
    this.goTo([editSocialManifestRoute(this.social_id)]);
  }

  public get title(): string {
    return this.creatingNewSocial ? 'New Social Form' : 'Edit Social Form';
  }

  public get nameErrors(): string[] {
    const errors = this.socialForm.controls.name.errors || {};
    const errorKeys = Object.keys(errors);
    const errorStrings = errorKeys.map(key => `${key}: ${errors[key]}`);

    return errorStrings;
  }

  public get start_dateErrors(): string[] {
    const errors = Object.keys(this.socialForm.controls.start_at.errors || {});
    return errors;
  }

  public get max_occupancyErrors(): string[] {
    const errors = Object.keys(this.socialForm.controls.max_attendants.errors || {});
    return errors;
  }

  public get end_dateErrors(): string[] {
    const errors = Object.keys(this.socialForm.controls.end_at.errors || {});
    return errors;
  }


  public getTime(type): string {
    if (!this.socialForm || !type) {
      return '';
    }
    const dateString = this.socialForm.controls[`${type}`].value as string;

    const formattedDateString = this.momentService.humanizeDateWithTime(dateString, false);
    return formattedDateString;
  }

  public get shouldEnableUpdateButton(): boolean {
    const isFormValid = this.socialForm.valid;
    const isFormDirty = this.socialForm.dirty;
    const should = !this.creatingNewSocial && isFormValid && isFormDirty;

    return should;
  }

  public get shouldEnableCreateButton(): boolean {
    const isFormValid = this.socialForm.valid;
    const isFormDirty = this.socialForm.dirty;
    const should = this.creatingNewSocial && isFormValid && isFormDirty;

    return should;
  }

  public createSocial(): void {
    const data = this.socialForm.getRawValue();

    const social = this.copy(data) as Social;

    this.dispatchAction(createSocial({ social }));
  }

  public updateSocial(): void {
    const formControls = this.socialForm.controls;
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

    this.socialForm.markAsPristine();
    this.socialForm.markAsUntouched();
    this.dispatchAction(updateSocial({ id: this.social_id, social: changedValue }));
  }

  private buildDate(date: Date, time: string) {
    const [hours, minutes] = (time || '0:0').split(':');
    const newDate = new Date(date);

    newDate.setHours(+hours);
    newDate.setMinutes(+minutes);
    newDate.setSeconds(0);

    return new Date(newDate);
  }

  private updateForm(social: Social): void {

    const formValues = this.socialForm.getRawValue();

    this.socialForm.controls.name.setValue(social.name);
    this.socialForm.controls.description.setValue(social.description);
    this.socialForm.controls.address.setValue(social.address);
    this.socialForm.controls.max_attendants.setValue(social.max_attendants);

    const start = new Date(social.start_at);

    this.socialStartDateTimeForm.patchValue({
      date: start.getDate(),
      hour: start.getHours(),
      minute: start.getMinutes(),
      month: start.getMonth(),
      year: start.getFullYear(),
    });

    const end = new Date(social.end_at);

    this.socialEndDateTimeForm.patchValue({
      date: end.getDate(),
      hour: end.getHours(),
      minute: end.getMinutes(),
      month: end.getMonth(),
      year: end.getFullYear(),
    });

    this.socialForm.markAsPristine();
  }

  private buildForm(): void {
    const currentDate = new Date();

    this.socialStartDateTimeForm = this.fb.group({
      date: new UntypedFormControl(currentDate.getDate(), Validators.required),
      month: new UntypedFormControl(currentDate.getMonth(), Validators.required),
      year: new UntypedFormControl(currentDate.getFullYear(), Validators.required),
      hour: new UntypedFormControl(currentDate.getHours(), Validators.required),
      minute: new UntypedFormControl(currentDate.getMinutes(), Validators.required),
    });

    this.socialStartDateTimeForm.valueChanges.subscribe((value) => {
      const start_date_time = this.buildDate(new Date(value.year, value.month, value.date), `${value.hour}:${value.minute}`);

      this.socialForm.controls.start_at.setValue(start_date_time);
      this.socialForm.controls.start_at.markAsDirty();
      this.socialForm.controls.start_at.updateValueAndValidity();

      const end_date_time = new Date(start_date_time);
      end_date_time.setHours(end_date_time.getHours() + 3);

      this.socialEndDateTimeForm.patchValue({
        date: end_date_time.getDate(),
        month: end_date_time.getMonth(),
        year: end_date_time.getFullYear(),
        hour: end_date_time.getHours(),
        minute: end_date_time.getMinutes()
      });

      this.socialEndDateTimeForm.markAsDirty();
      this.socialEndDateTimeForm.updateValueAndValidity();
    });

    this.socialEndDateTimeForm = this.fb.group({
      date: new UntypedFormControl(currentDate.getDate(), Validators.required),
      month: new UntypedFormControl(currentDate.getMonth(), Validators.required),
      year: new UntypedFormControl(currentDate.getFullYear(), Validators.required),
      hour: new UntypedFormControl(currentDate.getHours(), Validators.required),
      minute: new UntypedFormControl(currentDate.getMinutes(), Validators.required),
    });

    this.socialEndDateTimeForm.valueChanges.subscribe((value) => {
      const end_date_time = this.buildDate(new Date(value.year, value.month, value.date), `${value.hour}:${value.minute}`);
      this.socialForm.controls.end_at.setValue(end_date_time);
      this.socialForm.controls.end_at.markAsDirty();
      this.socialForm.controls.end_at.updateValueAndValidity();
    });

    this.socialForm = this.fb.group({
      name: new UntypedFormControl('', [
        (control) => {
          const name = control.value.trim();
          const valid = control.pristine || !!name;
          return valid ? null : { invalid: 'name cannot be empty.' };
        },
        Validators.required,
      ].filter(Boolean)),
      description: new UntypedFormControl('', [
        (control) => {
          const description = control.value.trim();
          const valid = control.pristine || !!description;
          return valid ? null : { invalid: 'description cannot be empty.' };
        },
        Validators.required,
      ].filter(Boolean)),
      start_at: new UntypedFormControl(undefined, [
        Validators.required,
        (control) => {
          if (!this.socialForm) {
            return null;
          }

          if (!control.value) {
            return null;
          }

          const selectedDate = new Date(control.value);
          const now = Date.now();
          const end = this.socialForm.controls.end_at.value;

          if (!end) {
            return null;
          }

          const valid = !this.creatingNewSocial || selectedDate.getTime() > now;
          return valid ? null : { 'Start date cannot be in the past!': control.value };
        },
      ]),
      end_at: new UntypedFormControl(undefined, [
        Validators.required,
        ((control) => {
          if (!this.socialForm) {
            return null;
          }
          if (!control.value) {
            return null;
          }
          const selectedDate = new Date(control.value);
          const start = this.socialForm.controls.start_at.value;
          const endTime = selectedDate.getTime();
          const startTime = start.getTime();
          const valid = endTime > startTime;

          return valid ? null : { 'End date must be greater than start date!': control.value };
        }).bind(this),
      ]),
      max_attendants: new UntypedFormControl(-1, Validators.required),
      address: new UntypedFormControl('', Validators.required),
    });

    if (this.creatingNewSocial) {
      const startMoment = new Date();

      startMoment.setDate(startMoment.getDate() + 1);

      const start_date = new Date(startMoment);

      this.socialStartDateTimeForm.controls.date.setValue(start_date.getDate());
      this.socialStartDateTimeForm.controls.month.setValue(start_date.getMonth());
      this.socialStartDateTimeForm.controls.year.setValue(start_date.getFullYear());
      this.socialStartDateTimeForm.controls.hour.setValue(start_date.getHours());
      this.socialStartDateTimeForm.controls.minute.setValue(start_date.getMinutes());

      startMoment.setHours(startMoment.getHours() + 3);

      const sailEnd = new Date(startMoment);

      this.socialEndDateTimeForm.controls.date.setValue(sailEnd.getDate());
      this.socialEndDateTimeForm.controls.month.setValue(sailEnd.getMonth());
      this.socialEndDateTimeForm.controls.year.setValue(sailEnd.getFullYear());
      this.socialEndDateTimeForm.controls.hour.setValue(sailEnd.getHours());
      this.socialEndDateTimeForm.controls.minute.setValue(sailEnd.getMinutes());
    }
  }

}
