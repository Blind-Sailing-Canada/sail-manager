
import {
  ExtractJwt,
  Strategy
} from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    /*
        From nestjs documentation https://docs.nestjs.com/techniques/authentication
        "
          The validate() method deserves some discussion.
          For the jwt-strategy, Passport first verifies the JWT's signature and decodes the JSON.
          It then invokes our validate() method passing the decoded JSON as its single parameter.
          Based on the way JWT signing works,
          we're guaranteed that we're receiving a valid token
          that we have previously signed and issued to a valid user
        "
      */
    return {
      user_id: payload.sub,
      username: payload.username,
      ...payload,
    };
  }
}
