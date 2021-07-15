import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { ProfileStatus } from '../types/profile/profile-status';
import { JwtObject } from '../types/token/jwt-object';

@Injectable()
export class ApprovedUserGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const profileStatus = user.status;

    if (request.path.startsWith('/profile/') && request.method.toUpperCase() === 'PATCH') {
      return profileStatus === ProfileStatus.Approved || profileStatus === ProfileStatus.Registration;
    }

    return profileStatus === ProfileStatus.Approved;
  }

}
