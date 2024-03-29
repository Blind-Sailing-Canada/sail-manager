import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtObject } from '../types/token/jwt-object';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const cachedToken = this.authService.getCachedToken(user.user_id);

    if (cachedToken) {
      return cachedToken.expire_at.getTime() > Date.now();
    }

    const storedToken = await this.authService.getStoredToken(user.user_id);

    if (storedToken && storedToken.expire_at.getTime() > Date.now()) {
      this.authService.cacheToken(user.profile_id, storedToken.token, storedToken.expire_at);

      return storedToken.expire_at.getTime() > Date.now();
    }

    return false;
  }
}
