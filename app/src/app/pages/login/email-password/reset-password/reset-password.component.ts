import 'firebase/auth';
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
import { FirebaseService } from '../../../../services/firebase.service';
import { BasePageComponent } from '../../../base-page/base-page.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BasePageComponent implements OnInit {

  public hide = true;
  public form: FormGroup;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {
    super(store);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  public get email() { return this.form.get('email'); }

  public resetPassword(): void {
    this
      .firebaseService
      .sendPasswordResetEmail(this.validateEmail)
      .then(() => {
        this.dispatchMessage('Password reset email sent.');
        this.form.markAsPristine();
      })
      .catch((error) => {
        this.dispatchError(`Failed to reset password: ${error.message}`);
        console.error(error);
      });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      email: this.fb.control('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.email,
      ]),
    });
  }

  private get validateEmail(): string {
    return `${this.form.controls.email.value}`.trim();
  }

}
