import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileStatus } from '../../../../../api/src/types/profile/profile-status';
import { JwtObject } from '../../../../../api/src/types/token/jwt-object';
import {
  editProfileRoute,
  FullRoutes,
  loginWithEmailAndPassword,
} from '../../routes/routes';
import { TokenService } from '../../services/token.service';
import {
  authenticateWithGoogle,
  logIn,
} from '../../store/actions/login.actions';
import { STORE_SLICES } from '../../store/store';
import { decodeJwt } from '../../utils/jwt';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent extends BasePageComponent implements OnInit {

  public emailAndPasswordLink = loginWithEmailAndPassword.toString();

  constructor(
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(TokenService) private tokenService: TokenService,
    @Inject(Store) store: Store<any>,
    @Inject(HttpClient) private httpClient: HttpClient,
  ) {
    super(store, route, router);
  }

  async ngOnInit() {
    const csrfToken = await this.httpClient.get<{csrfToken: string}>('/api/csrfToken').toPromise();
    sessionStorage.setItem('csrfToken', csrfToken.csrfToken);

    let token = this.route.snapshot.params.token;

    if (!token && this.tokenService.savedToken) {
      token = this.tokenService.savedToken;
      this.tokenService.loginThroughSavedToken();
    }

    if (!token) {
      return;
    }

    const tokenObject: JwtObject = decodeJwt(token);

    if (tokenObject.expireAt < Date.now()) {
      if (tokenObject.provider === 'google') {
        this.authenticateWithGoogle();
      } else {
        window.location.href = '/login/email-password';
      }

      return;
    }

    this.subscribeToStoreSlice(STORE_SLICES.LOGIN, (login) => {
      if (!login.user || !login.token) {
        return;
      }

      switch (login.user.status) {
        case ProfileStatus.Approved:
          const redirectTo = window
            .sessionStorage
            .getItem('redirectTo') || FullRoutes.DASHBOARD.toString();

          window.sessionStorage.removeItem('redirectTo');

          this.router.navigateByUrl(redirectTo);
          break;
        case ProfileStatus.Registration:
          this.goTo([editProfileRoute(login.user.id)], undefined);
          break;
        case ProfileStatus.PendingApproval:
        case ProfileStatus.Deactivated:
        case ProfileStatus.Rejected:
        default:
          this.goTo([FullRoutes.ACCOUNT_REVIEW], undefined);
          break;
      }
    });

    this.dispatchAction(logIn({ token }));
  }

  public authenticateWithGoogle(): void {
    this.dispatchAction(authenticateWithGoogle());
  }

}
