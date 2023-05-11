import * as express from 'express';
import {
  BadRequestException,
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
import { UserEntity } from '../user/user.entity';
import { Profile } from '../types/profile/profile';
import { ProviderUser } from '../types/user/provider-user';
import { AuthenticatedUser } from '../types/user/authenticated-user';
import { ProfileStatus } from '../types/profile/profile-status';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ProfileNewJob } from '../types/profile/profile-new-job';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => FirebaseAdminService)) private readonly firebaseAdminService: FirebaseAdminService,
    @InjectQueue('profile') private readonly profileQueue: Queue
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
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const authenticated_user: AuthenticatedUser = req.user;
    const token = await this.authService.login(authenticated_user, 'google');

    if (token) {
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

    const user_id = user.user_id;

    this.authService.logout(user_id);

    if (typeof req.logout === 'function') {
      req.logout();
    }

    req.user = undefined;
    req.original_user = {
      user_id,
      profile_id: user.profile_id,
      username: user.username
    };
  }

  @Get('login')
  @UseGuards(AuthGuard('jwt'), LoginGuard)
  async login(@User() user: JwtObject): Promise<ProfileEntity> {
    const profile_id = user.profile_id;

    if  (!profile_id) {
      return null;
    }

    const profile = await ProfileEntity.findOne({ where: { id: profile_id } });

    return profile;
  }

  @Post('create-profile')
  @UseGuards(AuthGuard('jwt'), LoginGuard)
  async createProfile(@User() user: JwtObject, @Body() profile_data: Profile): Promise<ProfileEntity> {
    const user_id = user.user_id;

    const user_entity = await UserEntity.findOne({
      where: { id: user_id } ,
      relations: ['profile']
    });

    if (!user_entity) {
      throw new BadRequestException(`UserEntity with id ${user_id} does not exist.`);
    }

    if (user_entity.profile) {
      throw new BadRequestException(`UserEntity with id ${user_id} already has a profile.`);
    }

    const provider_user: ProviderUser = {
      bio: (profile_data.bio || '').trim(),
      email: (profile_data.email || '').trim(),
      id: user.provider_user.id,
      name: (profile_data.name || '').trim(),
      phone: (profile_data.phone || '').trim(),
      photo: (profile_data.photo || '').trim(),
      provider: user.provider,
      status: ProfileStatus.PendingApproval,
    };

    return this.authService
      .createNewProfileForExistingUser(provider_user, user_entity.id)
      .then((profile) => {
        const job: ProfileNewJob = { profile_id: profile.id };

        this.profileQueue.add('new-profile', job);

        this.authService.logout(user.user_id);

        return profile;
      })
      .catch(error => {
        throw new BadRequestException(error.detail || error.message || error);
      });
  }

  @Get('login-firebase/:idToken')
  async loginFirebase(@Param('idToken') idToken, @Response() res: express.Response) {
    const firebase_decoded_token = await this.firebaseAdminService.validateFirebaseAuthToken(idToken);
    const firebase_user = await this.firebaseAdminService.getFirebaseUser(firebase_decoded_token.uid);
    const validated_user = await this.authService.validateUser(firebase_decoded_token as any, 'firebase');

    const provider_user: ProviderUser = {
      email: firebase_user.email,
      id: firebase_user.uid,
      name: firebase_user.displayName,
      photo: firebase_user.photoURL,
      phone: firebase_user.phoneNumber,
      provider: 'firebase'
    };

    const authenticated_user: AuthenticatedUser = {
      user_entity: validated_user,
      provider_user,
    };

    const jwtToken = await this.authService.login(authenticated_user, 'firebase');

    res.redirect(302, `${DOMAIN}/login/${jwtToken}`);
  }

  @Post('existing-user')
  checkForExistingUser(@Body('email') email: string): Promise<boolean> {
    return ProfileEntity
      .count({ where: { email: `${email}`.toLowerCase() } })
      .then(count => count > 0);
  }
}
