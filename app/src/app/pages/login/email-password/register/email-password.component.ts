import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { resetPassword } from '../../../../routes/routes';
import { FirebaseService } from '../../../../services/firebase.service';
import { BasePageComponent } from '../../../base-page/base-page.component';

@Component({
  selector: 'app-email-password',
  templateUrl: './email-password.component.html',
  styleUrls: ['./email-password.component.scss']
})
export class EmailPasswordComponent extends BasePageComponent implements OnInit {

  public form: UntypedFormGroup;
  public hide = true;
  public resetPasswordLink = resetPassword.toString();

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(Store) store: Store<any>,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {
    super(store);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  public get email() { return this.form.get('email'); }
  public get password() { return this.form.get('password'); }

  public register(): void {
    const password = this.validatePassword;
    const email = this.validateEmail;

    if (!password) {
      this.form.patchValue({ password: '' });
      return;
    }

    if (!email) {
      this.form.patchValue({ email: '' });
      return;
    }

    this.http
      .post('/api/auth/existing-user', { email })
      .toPromise()
      .then((existing) => {
        if (existing) {
          throw new Error('Email is already in use.');
        }

        return this.firebaseService.createUserWithEmailAndPassword(email, password);
      })
      .then(() => this.login())
      .catch((error) => {
        this.dispatchError(error.message);
        console.error(error);
      });
  }

  public login(): void {
    const password = this.validatePassword;
    const email = this.validateEmail;

    if (!password) {
      this.form.patchValue({ password: '' });
      return;
    }

    if (!email) {
      this.form.patchValue({ email: '' });
      return;
    }

    try {
      this
        .firebaseService
        .signInWithEmailAndPassword(email, password)
        .then(() => this.firebaseService.currentUser.getIdToken())
        .then(token => window.location.href = `/api/auth/login-firebase/${token}`)
        .catch((error) => {
          this.dispatchMessage(`Failed to login: ${error.message}`);
          console.error(error);
        });
    } catch (error) {
      this.dispatchMessage('Failed to login: authentication not set up.');
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      email: this.fb.control('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.email,
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
    });
  }

  private get validateEmail(): string {
    return `${this.form.controls.email.value}`.trim();
  }

  private get validatePassword(): string {
    return `${this.form.controls.password.value}`.trim();
  }

}
