import { Observable, throwError } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TokenService } from '../services/token.service';
import { logOut } from '../store/actions/login.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    @Inject(TokenService) private tokenService: TokenService,
    @Inject(Store) private store: Store<any>,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.token;
    const expired = this.tokenService.isExpired;
    const path = req.url;

    const timezone = typeof Intl === 'undefined' ? '' : Intl.DateTimeFormat().resolvedOptions().timeZone;

    const newRequest = req
      .clone({
        headers: req
          .headers
          .set('x-timezone', timezone)
          .set('authorization', `Bearer ${token}`)
      });

    if (path !== '/api/auth/logout' && token && expired) {
      this.store.dispatch(logOut({ message: 'Your session has expired.' }));
      return throwError(() => new Error(
        `Your session has expired (${this.tokenService.tokenData.username}:${this.tokenService.tokenData?.profile_id}).`
      ));
    }

    return next.handle(newRequest);
  }
}
