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

import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Social } from '../../../../../../api/src/types/social/social';
import { firstValueFrom } from 'rxjs';
import { SocialService } from '../../../services/social.service';

@Component({
  selector: 'app-social-create-many-page',
  templateUrl: './social-create-many-page.component.html',
  styleUrls: ['./social-create-many-page.component.scss']
})
export class SocialCreateManyPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public socialForm: UntypedFormGroup;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(SocialService) private socialService: SocialService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.buildForm();
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SOCIALS, () => { });
  }

  public get shouldEnableCreateButton(): boolean {
    const isFormValid = this.socialForm.valid;
    const isFormDirty = this.socialForm.dirty;
    const should = isFormValid && isFormDirty;

    return should;
  }

  public async createSocials(): Promise<void> {
    const data = this.socialForm.getRawValue().socialsBatchData;
    const socials = JSON.parse(data) as Social[];

    this.startLoading();

    await firstValueFrom(
      this.socialService.createMany(socials)
    )
      .then((results) => {
        this.dispatchMessage(`Created ${results.length} socials.`);
        this.socialForm.reset('[\n\n\n\n\n\]');
      })
      .catch(error => this.dispatchErrorEvent(error))
      .finally(() => this.finishLoading());
  }

  private buildForm(): void {
    this.socialForm = this.fb.group({
      socialsBatchData: new UntypedFormControl('[\n\n\n\n\n\]', [
        (control) => {
          const value = (control.value || '').trim();
          const valid = control.pristine || !!value;
          return valid ? null : { invalid: 'batch data cannot be empty' };
        },
        Validators.required,
      ].filter(Boolean)),
    });
  }

}
