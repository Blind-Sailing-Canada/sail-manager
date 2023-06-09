import {
  Injectable,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DeleteResult } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { TokenEntity } from '../token/token.entity';
import { JwtObject } from '../types/token/jwt-object';
import { UserEntity } from '../user/user.entity';
import { jwtConstants } from './constants';
import { GoogleUser } from '../types/auth/google.user';
import { UserAccessEntity } from '../user-access/user-access.entity';
import { FirebaseUser } from '../types/auth/firebase.user';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ProfileRole } from '../types/profile/profile-role';
import { ProfileStatus } from '../types/profile/profile-status';
import { DefaultUserAccess } from '../types/user-access/default-user-access';
import { v4 as uuidv4 } from 'uuid';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProviderUser } from '../types/user/provider-user';
import { AuthenticatedUser } from '../types/user/authenticated-user';

export interface CachedToken {
  token: string;
  expire_at: Date;
}

export interface TokenCache {
  [propName: string]: CachedToken;
}

@Injectable()
export class AuthService {

  private readonly tokens: TokenCache = {};
  private readonly logger: Logger;

  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly emailService: GoogleEmailService
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  public async createAdminUser() {
    const adminUser = await this.firebaseAdminService.createAdminUser();
    const providerUser: ProviderUser = {
      id: adminUser.uid,
      email: adminUser.email,
      name: 'admin',
      photo: adminUser.photoURL,
      roles: [ProfileRole.Admin],
      provider: 'firebase',
      status: ProfileStatus.Approved,
      access: {
        ...DefaultUserAccess,
        editUserAccess: true,
      },
    };

    const admin_user = await this.createNewUser(providerUser);

    await this.createNewProfileForExistingUser(providerUser, admin_user.id);

    return admin_user;
  }

  public async createEmailPasswordUser(name: string, email: string, password: string) {
    const existingUser = await ProfileEntity.findOne({ where: { email } });

    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    const user = await this.firebaseAdminService.createUser(name, email, password);

    const providerUser: ProviderUser = {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      photo: user.photoURL,
      roles: [],
      provider: 'firebase',
      status: ProfileStatus.Approved,
      access: { ...DefaultUserAccess },
    };

    const resetPasswordLink = await this.firebaseAdminService.generatePasswordResetLink(email);

    const createdUser = await this.createNewUser(providerUser);

    await this.createNewProfileForExistingUser(providerUser, createdUser.id);

    await this.emailService.sendToEmail({
      to: [email],
      subject: 'COMPANY_NAME_SHORT_HEADER: reset password',
      content: `
        <h1>Hello, ${name}!</h1>
        <p>COMPANY_NAME_HEADER has created a new account for you.</p>
        <p>Please follow the following link to reset your password.</p>
        <p><a href="${resetPasswordLink}">Reset password.</a></p>
      `,
    });

    return createdUser;
  }

  public getCachedToken(user_id: string): CachedToken {
    return this.tokens[user_id];
  }

  public getStoredToken(user_id: string): Promise<TokenEntity> {
    return TokenEntity.findOne({ where: { user_id: user_id } });
  }

  /**
     * user comes from one of the authentication providers (ex: google)
     *
     */
  async validateUser(user: ProviderUser | GoogleUser | FirebaseUser, provider: string): Promise<UserEntity> {

    let providerUser: ProviderUser;

    switch (provider) {
      case 'google':
        providerUser = {
          id: (user as GoogleUser).id,
          name: (user as GoogleUser).displayName,
          email: (user as GoogleUser).emails[0].value,
          photo: (user as GoogleUser).photos[0].value,
          provider,
        };
        break;
      case 'firebase':
        providerUser = {
          id: (user as FirebaseUser).user_id,
          name:  (user as FirebaseUser).email.split('@')[0],
          email: (user as FirebaseUser).email,
          photo: '',
          provider,
        };
        break;
    }

    const existingUser = await UserEntity
      .findOne({
        relations: ['profile'],
        where: { provider_user_id: providerUser.id },
      });

    if (existingUser) {
      return existingUser;
    }

    return this.createNewUser(providerUser);
  }

  logout(user_id: string): Promise<DeleteResult> {
    delete this.tokens[user_id];

    return TokenEntity
      .delete({ user_id: user_id } )
      .catch(error => {
        this.logger.error(error);
        return null;
      });
  }

  public cacheToken(user_id: string, token: string, expire_at: Date): void {
    this.tokens[user_id] = {
      expire_at,
      token,
    };
  }

  private deleteCacheToken(user_id: string): void {
    delete this.tokens[user_id];
  }

  async login(authenticated_user: AuthenticatedUser, provider: string): Promise<string> {

    const user: UserEntity = authenticated_user.user_entity;
    const provider_user: ProviderUser = authenticated_user.provider_user;

    try {
      if (user.profile_id) {
        ProfileEntity
          .update({ id: user.profile_id }, { last_login: new Date() })
          .catch((error) => this.logger.error(error));
      }
    } catch (error) {
      this.logger.error(error);
    }

    const cachedToken = this.tokens[user.id];

    if (cachedToken && cachedToken.expire_at.getTime() > Date.now()) {
      return Promise.resolve(cachedToken.token);
    }

    if (cachedToken) {
      this.deleteCacheToken(user.id);
    }

    if (!cachedToken) {
      // this is skipped if cached token is expired
      // try db stored token
      const dbToken:TokenEntity = await TokenEntity.findOne({ where: { user_id: user.id } });

      if (dbToken && dbToken.expire_at.getTime() > Date.now()) {
        this.cacheToken(user.profile_id, dbToken.token, dbToken.expire_at);

        return Promise.resolve(dbToken.token);
      }

      if (dbToken) {
        // token has expired so we delete it
        await dbToken.remove();
      }
    }

    // at this point we didn't find an existing valid token
    // so we create a new one

    const profile: ProfileEntity = user.profile || {} as ProfileEntity;
    const expireAtDate = new Date();
    const access = profile.access;

    expireAtDate.setTime(expireAtDate.getTime() + (jwtConstants.expiresIn * 1000));

    const payload: JwtObject = {
      access: access?.access || {},
      email: profile.email,
      username: profile.name,
      iat: new Date().getTime(),
      profile_id: profile.id,
      provider,
      provider_user: provider_user,
      roles: profile.roles,
      status: profile.status || ProfileStatus.Registration,
      sub: profile.id,
      user_id: user.id,
      expire_time: expireAtDate.getTime(),
    };

    const token = this.jwtService.sign(payload);

    const dbToken = TokenEntity.create({
      token,
      provider,
      user_id: user.id,
      expire_at: expireAtDate,
    });

    await dbToken.save();

    this.cacheToken(user.id, token, expireAtDate);

    return token;
  }

  private async createNewUser(user: ProviderUser): Promise<UserEntity> {

    this.logger.log(`CREATING NEW USER ${JSON.stringify(user, null, 2)}`);

    const newUser = await UserEntity
      .create({
        id: uuidv4(),
        provider: user.provider,
        provider_user_id: user.id,
      })
      .save();

    return UserEntity.findOne({
      where: { id: newUser.id },
      relations: ['profile'],
    });
  }

  public async createNewProfileForExistingUser(user: ProviderUser, existingUserEntityId: string): Promise<ProfileEntity> {

    this.logger.log(`CREATING NEW PROFILE FOR EXISTING USER ${JSON.stringify(user, null, 2)}`);

    const newProfile = ProfileEntity
      .create({
        bio: user.bio,
        email: user.email,
        expires_at: null,
        id: uuidv4(),
        name: user.name,
        phone: user.phone,
        photo: user.photo,
        roles: user.roles || [],
        status: user.status || ProfileStatus.Registration,
      });

    const newUserAccess = UserAccessEntity
      .create({
        access: {
          ...DefaultUserAccess,
          ...user.access,
        },
        profile: newProfile,
      });

    const newUser = UserEntity
      .create({
        id: existingUserEntityId,
        provider: user.provider,
        provider_user_id: user.id,
        profile: newProfile,
        original_profile_id: newProfile.id,
      });

    await UserEntity.getRepository().manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(newProfile);
      await transactionalEntityManager.save(newUserAccess);
      await transactionalEntityManager.save(newUser);
    });

    return ProfileEntity.findOne({ where: { id: newProfile.id } });
  }

}
