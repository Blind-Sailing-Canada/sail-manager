import { take } from 'rxjs/operators';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { ILoginState } from '../models/login-state.interface';
import {
  IProfileMap,
  IProfileState,
} from '../models/profile-state.interface';
import {
  editProfileRoute,
  FullRoutes,
  RootRoutes,
  SubRoutes,
} from '../routes/routes';
import { TokenService } from '../services/token.service';
import { STORE_SLICES } from '../store/store';
import { Profile } from '../../../../api/src/types/profile/profile';
import { ProfileStatus } from '../../../../api/src/types/profile/profile-status';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    @Inject(Router) private router: Router,
    @Inject(Store) private store: Store<any>,
    @Inject(TokenService) private tokenService: TokenService,
  ) { }

  async getProfile(url: string): Promise<Profile> {
    const token = this.tokenService.token;

    if (!token) {
      window.sessionStorage.setItem('redirectTo', url);
      return null;
    }

    const loggedInUser = await this.store
      .select(STORE_SLICES.LOGIN)
      .pipe(take(1))
      .toPromise()
      .then((login: ILoginState) => login.user);

    if (!token || !loggedInUser || this.tokenService.isExpired) {
      window.sessionStorage.setItem('redirectTo', url);

      this.router.navigate([FullRoutes.LOGIN]);
      return Promise.resolve(null);
    }

    const profile = await this.store
      .select(STORE_SLICES.PROFILES)
      .pipe(take(1))
      .toPromise()
      .then((profiles: IProfileState) => profiles.profiles || {})
      .then((profiles: IProfileMap) => profiles[loggedInUser.id]);

    if (!profile) {
      this.router.navigate([FullRoutes.LOGIN]);
      return Promise.resolve(null);
    }

    return Promise.resolve(profile);
  }

  async canLoad(_route: Route, segments: UrlSegment[]): Promise<boolean> {
    const url = segments.join('/');

    const profile = await this.getProfile(url);

    if (!profile) {
      this.router.navigate([RootRoutes.ROOT]);
      return;
    }

    let can = false;

    const VIEW_PROFILE_ROUTE = `${RootRoutes.PROFILES}/${SubRoutes.VIEW_PROFILE}/${profile.id}`;
    const EDIT_PROFILE_ROUTE = `${RootRoutes.PROFILES}/${SubRoutes.EDIT_PROFILE}/${profile.id}`;

    switch (profile.status) {
      case ProfileStatus.Approved:
        can = true;
        break;
      case ProfileStatus.Registration:
        can = url === VIEW_PROFILE_ROUTE || url === EDIT_PROFILE_ROUTE;
        break;
      case ProfileStatus.Deactivated:
      case ProfileStatus.PendingApproval:
      case ProfileStatus.Rejected:
      default:
        can = false;
    }

    if (!can) {
      this.router.navigate([RootRoutes.LOGIN]);
    }

    return can;
  }

  async canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  async checkLogin(url: string): Promise<boolean> {
    const profile = await this.getProfile(url);

    let redirectTo = null;
    let can = true;

    if (!profile) {
      window.sessionStorage.setItem('redirectTo', url);
      this.router.navigate([RootRoutes.LOGIN]);

      return false;
    }

    switch (profile.status) {
      case ProfileStatus.Approved:
        can = true;
        break;
      case ProfileStatus.Registration:
        redirectTo = editProfileRoute(profile.id);
        break;
      case ProfileStatus.Deactivated:
      case ProfileStatus.PendingApproval:
      case ProfileStatus.Rejected:
      default:
        redirectTo = FullRoutes.ACCOUNT_REVIEW;
        break;
    }

    if (redirectTo) {
      can = redirectTo === url;
      if (!can) {
        this.router.navigate([redirectTo]);
      }
    }

    return can;
  }

  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }
}
