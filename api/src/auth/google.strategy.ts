import {
  Strategy,
  StrategyOptionsWithRequest,
  VerifyCallback
} from 'passport-google-oauth20';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { googleConstants } from './constants';
import { GoogleUser } from '../types/auth/google.user';
import { AuthenticatedUser } from '../types/user/authenticated-user';
import { ProviderUser } from '../types/user/provider-user';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      ...googleConstants,
      passReqToCallback: true,
      scope: [
        'profile',
        'email',
      ],
    } as StrategyOptionsWithRequest);
  }

  async validate(
    _request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleUser,
    done: VerifyCallback
  ) {

    if (!profile) {
      return done(new BadRequestException(), null);
    }

    try {
      const existingUser = await this.authService.validateUser(profile, 'google');
      if (!existingUser) {
        return done(new UnauthorizedException());
      }

      const provider_user: ProviderUser = {
        email: (profile.emails || [])[0]?.value.toLowerCase().trim(),
        id: profile.id,
        name: profile.displayName,
        photo: (profile.photos || [])[0]?.value,
        provider: 'google'
      };

      const authenticated_user: AuthenticatedUser = {
        user_entity: existingUser,
        provider_user,
      };

      return done(undefined, authenticated_user);
    } catch (error) {
      return done(error);
    }
  }
}
