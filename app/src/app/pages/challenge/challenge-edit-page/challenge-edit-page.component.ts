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
import { Challenge } from '../../../../../../api/src/types/challenge/challenge';
import { ChallengeStatus } from '../../../../../../api/src/types/challenge/challenge-status';
import { MomentService } from '../../../services/moment.service';
import {
  createChallenge,
  fetchChallenge,
  updateChallenge,
} from '../../../store/actions/challenge.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-challenge-edit-page',
  templateUrl: './challenge-edit-page.component.html',
  styleUrls: ['./challenge-edit-page.component.css']
})
export class ChallengeEditPageComponent extends BasePageComponent implements OnInit {

  public challengeId: string;
  public form: FormGroup;
  public ChallengeStatus = ChallengeStatus;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MomentService) private momentService: MomentService,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    this.challengeId = this.route.snapshot.params.challengeId;

    if (!this.challengeId) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES, () => {
      const challenge = this.store[STORE_SLICES.CHALLENGES][this.challengeId];

      if (challenge) {
        this.updateForm(challenge);
      }
    });

    this.dispatchAction(fetchChallenge({ challengeId: this.challengeId }));
  }

  public get title(): string {
    if (this.challengeId) {
      return 'Update Challenge Form';
    }

    return 'New Challenge Form';
  }

  public get shouldEnableCreateButton(): boolean {
    return this.form && this.form.valid && this.form.dirty && !this.challengeId;
  }

  public get shouldEnableUpdateButton(): boolean {
    return this.form && this.form.valid && this.form.dirty && !!this.challengeId;
  }

  public formErrors(controlName: string): string[] {
    const errors = Object.keys(this.form.controls[controlName].errors || {});
    return errors;
  }

  public createChallenge(): void {
    const challenge: Challenge = this.form.value;

    this.dispatchAction(createChallenge({ challenge }));
  }

  public updateChallenge(): void {
    const challenge: Challenge = Object
      .keys(this.form.controls)
      .filter(key => this.form.controls[key].dirty)
      .reduce(
        (red, key) => {
          red[key] = this.form.controls[key].value;
          return red;
        },
        {},
      ) as Challenge;

    if (challenge.end_date) {
      const time = challenge.end_date.toString().split('-');
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date.setFullYear(+time[0], +time[1] - 1, +time[2]);
      challenge.end_date = date;
    }

    if (challenge.start_date) {
      const time = challenge.start_date.toString().split('-');
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date.setFullYear(+time[0], +time[1] - 1, +time[2]);
      challenge.start_date = date;
    }

    this.dispatchAction(updateChallenge({ challenge, challengeId: this.challengeId, notify: true }));

  }

  private updateForm(challenge: Challenge): void {
    this.form.patchValue(challenge);
    this.form.controls.end_date.setValue(this.momentService.yyyymmdd(challenge.end_date));
    this.form.controls.start_date.setValue(this.momentService.yyyymmdd(challenge.start_date));
    this.form.controls.status.enable();

    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: this.fb.control(undefined, Validators.required),
      description: this.fb.control(undefined, Validators.required),
      start_date: this.fb.control(undefined),
      end_date: this.fb.control(undefined),
      badge: this.fb.control(undefined),
      status: this.fb.control({ value: ChallengeStatus.Active, disabled: true }),
    });
  }

}
