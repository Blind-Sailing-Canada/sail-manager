import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller, Get, Logger, Param, Patch, Post, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Queue } from 'bull';
import { AuthService } from '../auth/auth.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserAccessGuard } from '../guards/user-access.guard';
import { UserRoles } from '../guards/user-roles.decorator';
import { RequiredActionEntity } from '../required-action/required-action.entity';
import { Profile } from '../types/profile/profile';
import { ProfileReview } from '../types/profile/profile-review';
import { ProfileRole } from '../types/profile/profile-role';
import { ProfileStatus } from '../types/profile/profile-status';
import { RequiredActionStatus } from '../types/required-action/required-action-status';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { ProfileLink } from '../types/user/profile-link';
import { ProfileLinkInfo } from '../types/user/profile-link-info';
import { UserAccess } from '../user-access/user-access.decorator';
import { UserAccessEntity } from '../user-access/user-access.entity';
import { User } from '../user/user.decorator';
import { UserEntity } from '../user/user.entity';
import { ProfileUpdateSanitizer } from './pipes/profile-update.sanitizer';
import { ProfileEntity } from './profile.entity';
import { ProfileService } from './profile.service';
import { v4 as uuidv4 } from 'uuid';
import { ProfileApprovedJob } from '../types/profile/profile-approved-job';
import { Not } from 'typeorm';
import { RequiredActionType } from '../types/required-action/required-action-type';

@Crud({
  model: { type: ProfileEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
  },
  routes: { only: ['getManyBase',] },
})
@Controller('profile')
@ApiTags('profile')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private service: ProfileService,
    private authService: AuthService,
    @InjectQueue('profile') private readonly profileQueue: Queue
  ) {
    this.createAdminUser();
  }

  private async createAdminUser() {
    const count = await ProfileEntity.count({ loadEagerRelations: false });

    if (count === 0) {
      await this.authService.createAdminUser();
    }
  }

  @Get('/count')
  @UserRoles(ProfileRole.Admin)
  @UseGuards(RolesGuard)
  async count() {
    return this.service.count();
  }

  @Get('/:id')
  getProfileById(@Param('id') profile_id: string): Promise<Profile> {
    return ProfileEntity.findOneOrFail({
      where: { id: profile_id },
      relations: ['achievements']
    });
  }

  @Post('/create-user')
  @UserAccess(UserAccessFields.CreateAccounts)
  @UseGuards(UserAccessGuard)
  createUser(@Body('name') name: string, @Body('email') email: string) {
    return this.authService.createEmailPasswordUser(name, email, uuidv4());
  }

  @Patch('/link-accounts')
  @UserAccess(UserAccessFields.LinkAccounts)
  @UseGuards(UserAccessGuard)
  async linkAccounts(@User() user: JwtObject, @Body() linkInfo: ProfileLinkInfo) {
    await this.service.repository.manager.transaction(async (transactionalEntityManager) => {
      const deleted_at = new Date();
      let profileIdToDelete: string;

      if (linkInfo.linkType == ProfileLink.Primary) {
        await transactionalEntityManager.update(UserEntity, { profile_id: linkInfo.profile_idB }, {
          profile_id: linkInfo.profile_idA,
          original_profile_id: linkInfo.profile_idB,
          linked_by_profile_id: user.profile_id,
        });

        profileIdToDelete = linkInfo.profile_idB;
      } else {
        await transactionalEntityManager.update(UserEntity, { profile_id: linkInfo.profile_idA }, {
          profile_id: linkInfo.profile_idB,
          original_profile_id: linkInfo.profile_idA,
          linked_by_profile_id: user.profile_id,
        });

        profileIdToDelete = linkInfo.profile_idA;
      }

      const profileToDelete = await ProfileEntity.findOne({ where: { id : profileIdToDelete } });

      await transactionalEntityManager.update(ProfileEntity, { id: profileIdToDelete }, {
        email: `${profileToDelete.email}:deleted:${deleted_at.toISOString()}`,
        deleted_at: deleted_at,
      });
    });
  }

  @Patch('/:id/review')
  @UserAccess(UserAccessFields.EditUserAccess)
  @UseGuards(UserAccessGuard)
  async reviewProfile(@Param('id') profile_id: string, @Body() review: ProfileReview) {
    const profile = await ProfileEntity.findOneOrFail({ where: { id: profile_id } });

    await this.service.repository.manager.transaction(async transactionalEntityManager => {
      if (review.roles || review.status) {
        const newInfo: Partial<Profile> = { expires_at: null };

        if (review.roles) {
          newInfo.roles = review.roles;
        }

        if (review.status) {
          newInfo.status = review.status;
        }

        await transactionalEntityManager
          .update(
            ProfileEntity,
            { id: profile_id },
            newInfo
          );
      }

      if (review.access) {
        await transactionalEntityManager
          .update(
            UserAccessEntity,
            { profile_id: profile_id },
            { access: review.access }
          );
      }

      if (review.required_action_id) {
        await transactionalEntityManager
          .update(
            RequiredActionEntity,
            { id: review.required_action_id },
            { status: RequiredActionStatus.Completed }
          );
        await transactionalEntityManager
          .update(
            RequiredActionEntity,
            {
              actionable_id: profile_id,
              id: Not(review.required_action_id),
              required_action_type: RequiredActionType.ReviewNewUser,
            },
            { status: RequiredActionStatus.Dismissed }
          );
      }

      if (review.status === ProfileStatus.Approved && profile.status !== ProfileStatus.Approved) {
        const job: ProfileApprovedJob = { profile_id };

        this.profileQueue.add('profile-approved', job);
      }
    });

    const users = await UserEntity.find({ where: { profile_id } });

    for(const user of users) {
      await this.authService.logout(user.id).catch(error => this.logger.error(error));
    }

    return {
      access: await UserAccessEntity.findOne({ where: { profile_id: profile_id } }),
      profile: await ProfileEntity.findOne({ where: { id: profile_id } }),
      action: review.required_action_id?
        await RequiredActionEntity.findOne({ where: { id: review.required_action_id } }): undefined,
    };
  }

  @Patch('/:id')
  async updateProfileInfo(
  @User() user: JwtObject, @Param('id') id: string,
    @Body(new ProfileUpdateSanitizer()) profile: Partial<Profile>
  ) {
    if (!user) {
      throw new UnauthorizedException('no user');
    }

    if (user.profile_id !== id && !user.access[UserAccessFields.EditUserProfile]) {
      throw new UnauthorizedException('wrong user');
    }

    if (profile.email) {
      profile.email = profile.email.toLowerCase().trim();
    }

    const updatedProfile = ProfileEntity.create({
      id,
      ...profile,
    });

    await ProfileEntity.save(updatedProfile);

    return ProfileEntity.findOne({ where: { id } });
  }

}
