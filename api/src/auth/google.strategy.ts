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

      return done(undefined, existingUser);
    } catch (error) {
      return done(error);
    }
  }
}
