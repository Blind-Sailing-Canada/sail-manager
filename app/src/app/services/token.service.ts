import {
  Inject,
  Injectable,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { JwtObject } from '../../../../api/src/types/token/jwt-object';
import { ILoginState } from '../models/login-state.interface';
import { logIn } from '../store/actions/login.actions';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private login: ILoginState = {} as ILoginState;

  constructor(@Inject(Store) private store: Store<any>) {
    this.store.select('login').subscribe(login => this.login = login);
  }

  public get token(): string {
    return (this.login || {} as ILoginState).token;
  }

  public get savedToken(): string {
    return window.sessionStorage.getItem('token');
  }

  public get tokenData(): JwtObject {
    return (this.login || {} as ILoginState).tokenData;
  }

  public get isExpired(): boolean {
    if (!this.login || !this.login.tokenData) {
      return true;
    }

    const exp = this.login.tokenData.exp;

    return Date.now() >= (exp * 1000);
  }

  public loginThroughSavedToken(): void {
    this.store.dispatch(logIn({ token:  this.savedToken }));
  }
}
