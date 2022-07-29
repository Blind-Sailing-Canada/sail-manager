import { take } from 'rxjs/operators';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginState } from '../models/login-state';
import {
  IProfileMap,
  IProfileState,
} from '../models/profile-state.interface';
import { FullRoutes } from '../routes/routes';
import { TokenService } from '../services/token.service';
import { STORE_SLICES } from '../store/store';
import { Profile } from '../../../../api/src/types/profile/profile';
import { ProfileStatus } from '../../../../api/src/types/profile/profile-status';
import { ProfileRole } from '../../../../api/src/types/profile/profile-role';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    @Inject(Router) private router: Router,
    @Inject(Store) private store: Store<any>,
    @Inject(TokenService) private tokenService: TokenService,
  ) { }

  async getProfile(): Promise<Profile> {
    const token = this.tokenService.token;
    const loggedInUser = await this.store
      .select(STORE_SLICES.LOGIN)
      .pipe(take(1))
      .toPromise()
      .then((login: LoginState) => login.user);

    if (!token || !loggedInUser || this.tokenService.isExpired) {
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

  async canLoad(): Promise<boolean> {
    const can: boolean = await this.isAdmin();

    if (!can) {
      this.router.navigate(['/']);
    }

    return can;
  }

  async canActivate(): Promise<boolean> {
    const can: boolean = await this.isAdmin();

    if (!can) {
      this.router.navigate(['/']);
    }

    return can;
  }

  async canActivateChild(): Promise<boolean> {
    const can: boolean = await this.isAdmin();

    if (!can) {
      this.router.navigate(['/']);
    }

    return can;
  }

  private async isAdmin(): Promise<boolean> {
    const profile = await this.getProfile();

    const isAdmin = profile && profile.status === ProfileStatus.Approved && profile.roles.includes(ProfileRole.Admin);

    if (!isAdmin) {
      console.error('You must be admin to load this route');
    }

    return isAdmin;

  }
}
