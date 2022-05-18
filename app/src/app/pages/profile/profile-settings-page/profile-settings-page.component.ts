import { take } from 'rxjs/operators';
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
import { Store } from '@ngrx/store';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { SnackType } from '../../../models/snack-state.interface';
import { putSnack } from '../../../store/actions/snack.actions';
import { BasePageComponent } from '../../base-page/base-page.component';
import { SettingService } from '../../../services/setting.service';
import { Setting } from '../../../../../../api/src/types/settings/setting';

@Component({
  selector: 'app-profile-settings-page',
  templateUrl: './profile-settings-page.component.html',
  styleUrls: ['./profile-settings-page.component.css']
})
export class ProfileSettingsPageComponent extends BasePageComponent implements OnInit {

  public form: FormGroup;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(SettingService) private settingsService: SettingService,
  ) {
    super(store);
    this.buildForm();
  }

  ngOnInit(): void {
    this.settingsService
      .fetchSettingsForProfile(this.user.profile.id)
      .pipe(take(1))
      .subscribe((settings) => {
        this.updateForm(settings?.settings || {});
      });
  }

  public get profile(): Profile {
    return this.user.profile;
  }

  public saveSettings(): void {
    this.settingsService
      .updateSettingForProfile(
        this.user.profile.id,
        this.form.getRawValue()
      )
      .pipe(take(1))
      .subscribe((settings) => {
        this.updateForm(settings?.settings || {});
        this.dispatchAction(putSnack({ snack: { message: 'Saved', type: SnackType.INFO } }));
      });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      futureSails: this.fb.control(-1, Validators.required)
    });
  }

  private updateForm(settings: Setting): void {
    this.form.patchValue(settings);
  }


}
