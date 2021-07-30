
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { ProfileRole } from '../../../../api/src/types/profile/profile-role';
import { ProfileStatus } from '../../../../api/src/types/profile/profile-status';
import { UserAccessFields } from '../../../../api/src/types/user-access/user-access-fields';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class ViewUserSailsGuard implements CanActivate {
  constructor(
    @Inject(Router) private router: Router,
    @Inject(TokenService) private tokenService: TokenService,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const can: boolean = await this.can(route.params.profile_id);

    if (!can) {
      this.router.navigate(['/']);
    }

    return can;
  }

  private async can(profile_id: string): Promise<boolean> {
    if (this.tokenService.isExpired) {
      return false;
    }

    const tokenData = this.tokenService.tokenData;

    if (tokenData.status !== ProfileStatus.Approved) {
      return false;
    }

    const isAdmin = tokenData.roles.includes(ProfileRole.Admin);
    const access = tokenData.access.access || {};

    const hasAccess = profile_id === tokenData.profile_id || access[UserAccessFields.ViewUserSails];

    return isAdmin || hasAccess;

  }
}
