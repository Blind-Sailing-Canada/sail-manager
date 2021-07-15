import * as express from 'express';
import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Response,
  UnauthorizedException,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { LoginGuard } from '../guards/login.guard';
import { AuthService } from './auth.service';
import { DOMAIN } from './constants';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { JwtObject } from '../types/token/jwt-object';
import { ProfileEntity } from '../profile/profile.entity';
import { HttpExceptionFilter } from './exception.filter';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => FirebaseAdminService)) private readonly firebaseAdminService: FirebaseAdminService
  ) { }

  @Get('firebase-public-config')
  getFirebasePublicConfig(): Promise<any> {
    const config = {
      apiKey: process.env.FIREBASE_PUBLIC_CONFIG_API_KEY,
      appId: process.env.FIREBASE_PUBLIC_CONFIG_APP_ID,
      authDomain: process.env.FIREBASE_PUBLIC_CONFIG_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_PUBLIC_CONFIG_DATABASE_URL,
      messagingSenderId: process.env.FIREBASE_PUBLIC_CONFIG_MESSAGING_SENDER_ID,
      projectId: process.env.FIREBASE_PUBLIC_CONFIG_PROJECT_ID,
      storageBucket: process.env.FIREBASE_PUBLIC_CONFIG_STORAGE_BUCKET,
    };

    return Promise.resolve(config);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @UseFilters(new HttpExceptionFilter())
  async googleLoginCallback(@Req() req, @Response() res: express.Response) {
    const user = req.user;
    const token = await this.authService.login(user, 'google');

    if (user && token) {
      res.redirect(302, `${DOMAIN}/login/${token}`);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('logout')
  logout(@Req() req) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return 'piss off mate! first warning.';
    }

    const token = authorization.split(' ', 2)[1];
    let user: JwtObject;

    try {
      user = this.jwtService.verify(token, { ignoreExpiration: true });
    } catch (tokenError) {
      // tslint:disable-next-line: no-console
      console.error(tokenError);
      return 'piss off mate! second warning.';
    }

    if (!user) {
      return 'piss off mate! third warning.';
    }

    const profileId = user.profileId;

    this.authService.logout(profileId);
    req.logout();
    req.user = { userId: profileId };
  }

  @Get('login')
  @UseGuards(AuthGuard('jwt'), LoginGuard)
  login(@User() user: JwtObject): Promise<ProfileEntity> {
    const profileId = user.profileId;

    return ProfileEntity.findOne(profileId);
  }

  @Get('login-firebase/:idToken')
  async loginFirebase(@Param('idToken') idToken, @Response() res: express.Response) {
    const firebaseUser = await this.firebaseAdminService.validateFirebaseAuthToken(idToken);
    const validatedUser = await this.authService.validateUser(firebaseUser as any, 'firebase');
    const jwtToken = await this.authService.login(validatedUser, 'firebase');

    res.redirect(302, `${DOMAIN}/login/${jwtToken}`);
  }

  @Post('existing-user')
  checkForExistingUser(@Body('email') email: string): Promise<boolean> {
    return ProfileEntity
      .count({ email: `${email}`.toLowerCase() })
      .then(count => count > 0);
  }
}
