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
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  IProfileMap,
  IProfileState,
} from '../models/profile-state.interface';
import {
  editProfileRoute,
  FullRoutes,
  RootRoutes,
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

  async getProfile(): Promise<Profile> {
    const profile_id = this.tokenService.tokenData?.profile_id;

    if (!profile_id) {
      return null;
    }

    const profile = await this.store
      .select(STORE_SLICES.PROFILES)
      .pipe(take(1))
      .toPromise()
      .then((profiles: IProfileState) => profiles.profiles || {})
      .then((profiles: IProfileMap) => profiles[profile_id]);

    return Promise.resolve(profile);
  }

  async canLoad(_route: Route): Promise<boolean> {
    return true;
  }

  async canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  async checkLogin(url: string): Promise<boolean> {
    const profile = await this.getProfile();
    const profileStatus = profile?.status || this.tokenService.tokenData?.status;

    let redirectTo = null;
    let can = true;

    if (!profileStatus) {
      window.sessionStorage.setItem('redirectTo', url);
      this.router.navigate([RootRoutes.LOGIN]);

      return false;
    }

    switch (profileStatus) {
      case ProfileStatus.Approved:
        can = true;
        break;
      case ProfileStatus.Registration:
        redirectTo = editProfileRoute('new');
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
