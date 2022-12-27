import {
  Inject,
  Injectable,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { JwtObject } from '../../../../api/src/types/token/jwt-object';
import { LoginState } from '../models/login-state';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private login: LoginState = {} as LoginState;

  constructor(@Inject(Store) private store: Store<any>) {
    this.store.select('login').subscribe(login => this.login = login);
  }

  public get token(): string {
    return (this.login || {} as LoginState).token;
  }

  public get savedToken(): string {
    return window.localStorage.getItem('token');
  }

  public get tokenData(): JwtObject {
    return (this.login || {} as LoginState).tokenData;
  }

  public get isExpired(): boolean {
    if (!this.login || !this.login.tokenData) {
      return true;
    }

    const expired = Date.now() >= this.login.tokenData.expire_time;

    return expired;
  }

}
