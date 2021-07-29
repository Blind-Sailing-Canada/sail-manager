import {
  ConflictException,
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
import { getConnection } from 'typeorm';
import { FirebaseUser } from '../types/auth/firebase.user';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ProfileRole } from '../types/profile/profile-role';
import { ProfileStatus } from '../types/profile/profile-status';
import { Access } from '../types/user-access/access';
import { DefaultUserAccess } from '../types/user-access/default-user-access';
import { v4 as uuidv4 } from 'uuid';

export interface CachedToken {
  token: string;
  expireAt: Date;
}

export interface TokenCache {
  [propName: string]: CachedToken;
}

interface ProviderUser {
  id: string
  email: string;
  name: string;
  photo: string;
  provider: string;
  roles?: ProfileRole[];
  status?: ProfileStatus;
  access?: Access;
}

@Injectable()
export class AuthService {

  private readonly tokens: TokenCache = {};
  private readonly logger: Logger;

  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseAdminService: FirebaseAdminService
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

    return this.createNewUser(providerUser, false);
  }

  public getCachedToken(profileId: string): CachedToken {
    return this.tokens[profileId];
  }

  public getStoredToken(profileId: string): Promise<TokenEntity> {
    return TokenEntity.findOne({ where: { profileId } });
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
      .findOne({ where: { providerUserId: providerUser.id } });

    if (existingUser) {
      return existingUser;
    }

    if (!existingUser) {
      const profileExists = await ProfileEntity.count({ email: providerUser.email }) > 0;

      if (profileExists) {
        throw new ConflictException(
          `Email ${providerUser.email} is already in use but it is not linked to this authentication method.`
        );
      }
    }

    return this.createNewUser(providerUser);
  }

  logout(profileId: string): Promise<DeleteResult> {
    delete this.tokens[profileId];

    return TokenEntity
      .delete({ profileId } )
      .catch(error => {
        this.logger.error(error);
        return null;
      });
  }

  public cacheToken(profileId: string, token: string, expireAt: Date): void {
    this.tokens[profileId] = {
      expireAt,
      token,
    };
  }

  public deleteCacheToken(profileId: string): void {
    delete this.tokens[profileId];

  }

  async login(user: UserEntity, provider: string): Promise<string> {

    const cachedToken = this.tokens[user.profile.id];

    if (cachedToken && cachedToken.expireAt.getTime() > Date.now()) {
      return Promise.resolve(cachedToken.token);
    }

    if (cachedToken) {
      this.deleteCacheToken(user.profile.id);
    }

    if (!cachedToken) {
      // this is skipped if cached token is expired
      // try db stored token
      const dbToken:TokenEntity = await TokenEntity.findOne({ where: { profileId: user.profile.id } });

      if (dbToken && dbToken.expireAt.getTime() > Date.now()) {
        this.cacheToken(user.profile.id, dbToken.token, dbToken.expireAt);

        return Promise.resolve(dbToken.token);
      }

      if (dbToken) {
        // token has expired so we delete it
        await dbToken.remove();
      }
    }

    // at this point we didn't find an existing valid token
    // so we create a new one

    const profile: ProfileEntity = user.profile;
    const expireAtDate = new Date();
    const access = profile.access;

    expireAtDate.setTime(expireAtDate.getTime() + (jwtConstants.expiresIn * 1000));

    const payload: JwtObject = {
      provider,
      access,
      email: profile.email,
      expireAt: expireAtDate.getTime(),
      profileId: profile.id,
      roles: profile.roles,
      status: profile.status,
      sub: profile.id,
      username: profile.name,
    };

    const token = this.jwtService.sign(payload);

    const dbToken = TokenEntity.create({
      token,
      provider,
      profileId: profile.id,
      expireAt: expireAtDate,
    });

    await dbToken.save();

    this.cacheToken(profile.id, token, expireAtDate);

    return token;
  }

  private async createNewUser(user: ProviderUser, expires = true): Promise<UserEntity> {

    this.logger.log(`CREATING NEW USER ${JSON.stringify(user, null, 2)}`);

    const expiresAt = expires ? new Date(new Date().getTime() + (30 * 60 * 1000)): null;

    const newProfile = ProfileEntity
      .create({
        id: uuidv4(),
        email: user.email,
        expiresAt: expiresAt,
        name: user.name,
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
        id: uuidv4(),
        provider: user.provider,
        providerUserId: user.id,
        profile: newProfile,
        originalProfileId: newProfile.id,
      });

    await getConnection().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(newProfile);
      await transactionalEntityManager.save(newUserAccess);
      await transactionalEntityManager.save(newUser);
    });

    return UserEntity.findOne(newUser.id);
  }

}
