import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import {
  createClinic,
  updateClinic,
} from '../../../store/actions/clinic.actions';
import { searchProfilesByNameOrEmail } from '../../../store/actions/profile.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { Clinic } from '../../../../../../api/src/types/clinic/clinic';

@Component({
  selector: 'app-clinic-edit-page',
  templateUrl: './clinic-edit-page.component.html',
  styleUrls: ['./clinic-edit-page.component.css']
})
export class ClinicEditPageComponent extends BasePageComponent implements OnInit {

  public clinic: Clinic;
  public clinicId: string;
  public filteredInstructors: Profile[] = [];
  public form: FormGroup;
  public instructors: Profile[] = [];
  public icons: string[] = [];
  private instructorFilterText = '';

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.clinicId = this.route.snapshot.params.clinicId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.instructors = this.profilesArray;
      this.filterInstructors(this.instructorFilterText, false);
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CLINICS, (clinics) => {
      this.clinic = this.getClinic(this.clinicId);

      if (this.clinic) {
        this.updateForm();
      }
    });

    this.getIcons();
  }

  public instructorFilterListener(filter: string): void {
    this.instructorFilterText = filter;
    this.filterInstructors(filter, true);
  }

  public get instructorName(): string {
    if (!this.form) {
      return null;
    }

    const instructor = this.form.get('instructor_id').value;

    if (!instructor) {
      return;
    }

    const profile = this.getProfile(instructor);

    return (profile || {}).name;
  }

  public setInstructor(profile_id?: string): void {
    this.form.get('instructor_id').setValue(profile_id);
    this.form.get('instructor_id').markAsDirty();
    this.form.updateValueAndValidity();
    this.form.markAsDirty();
  }

  public setInstructorByKey(event, profile_id?: string): void {
    if (event.key !== 'Enter') {
      return;
    }
    this.setInstructor(profile_id);
  }

  public formErrors(controlName: string): string[] {
    const errors = Object.keys(this.form.controls[controlName].errors || {});
    return errors;
  }

  public get shouldEnableCreateButton(): boolean {
    return !this.clinicId && this.form && this.form.valid && this.form.dirty;
  }

  public get shouldEnableSaveButton(): boolean {
    return this.clinicId && this.form && this.form.valid && this.form.dirty;
  }

  public createClinic(): void {
    const clinic: Partial<Clinic> = this.form.getRawValue();

    if (clinic.badge) {
      clinic.badge = (clinic.badge as any as string[])[0];
    }

    this.dispatchAction(createClinic({ clinic }));
  }

  public get formTitle(): string {
    return this.clinicId ? 'Edit Clinic Form' : 'New Clinic Form';
  }

  public saveClinic(): void {
    const clinic: Partial<Clinic> = Object
      .keys(this.form.controls)
      .filter(key => this.form.get(key).dirty)
      .reduce(
        (red, key) => {
          red[key] = this.form.get(key).value;
          return red;
        },
        {},
      ) as Clinic;

    if (clinic.badge) {
      clinic.badge = (clinic.badge as any as string[])[0];
    }

    this.dispatchAction(updateClinic({ clinic, clinicId: this.clinicId, notify: true }));
  }

  private getIcons(): void {
    const ICON_LOCATION = environment.production ? 'cdn/list?directory=svg/icons' : 'cdn/list?directory=test/svg/icons';
    this.http
      .get<string[]>(ICON_LOCATION)
      .pipe(
        take(1)
      )
      .subscribe((icons) => {
        this.icons = icons || [];
        this.icons = this.icons
          .filter(icon => icon.toLowerCase().endsWith('.svg'))
          .map(icon => `cdn/files/${icon}`);
      });

  }
  private filterInstructors(filter: string, refetch: boolean = false): void {
    if (!filter) {
      this.filteredInstructors = this.instructors;
    } else {
      if (refetch && filter && filter.length > 3) {
        this.dispatchAction(searchProfilesByNameOrEmail({ text: filter, notify: true }));
      }
      this.filteredInstructors = this.instructors
        .filter(instructor => instructor.name.includes(filter) || instructor.email.includes(filter));
    }
  }

  private updateForm(): void {
    this.form.patchValue({ ...this.clinic, badge: [this.clinic.badge].filter(Boolean) });
    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      badge: this.fb.control(null, Validators.required),
      description: this.fb.control(undefined, Validators.required),
      instructor_id: this.fb.control(null),
      name: this.fb.control(undefined, Validators.required),
      start_date: this.fb.control(null),
      end_date: this.fb.control(null),
    });
  }
}
