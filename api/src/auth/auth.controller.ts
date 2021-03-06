import * as express from 'express';
import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Logger,
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
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => FirebaseAdminService)) private readonly firebaseAdminService: FirebaseAdminService
  ) { }

  @Get('firebase-public-config')
  getFirebasePublicConfig() {
    const base64Confirg = Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64');
    const config = JSON.parse(base64Confirg.toString('utf-8'));

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
      return 'not authorized';
    }

    const token = authorization.split(' ', 2)[1];
    let user: JwtObject;

    try {
      user = this.jwtService.verify(token, { ignoreExpiration: true });
    } catch (tokenError) {
      this.logger.error(tokenError);
      return 'no jwt';
    }

    if (!user) {
      return 'no user';
    }

    const profile_id = user.profile_id;

    this.authService.logout(profile_id);

    if (typeof req.logout === 'function') {
      req.logout();
    }

    req.user = { user_id: profile_id };
  }

  @Get('login')
  @UseGuards(AuthGuard('jwt'), LoginGuard)
  async login(@User() user: JwtObject): Promise<ProfileEntity> {
    const profile_id = user.profile_id;

    const profile = await ProfileEntity.findOne({ where: { id: profile_id } });

    return profile;
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
      .count({ where: { email: `${email}`.toLowerCase() } })
      .then(count => count > 0);
  }
}
