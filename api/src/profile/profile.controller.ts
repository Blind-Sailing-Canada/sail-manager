import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller, Get, Param, Patch, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Queue } from 'bull';
import { getManager } from 'typeorm';
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
import { RequiredActionType } from '../types/required-action/required-action-type';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { UserAccess } from '../user-access/user-access.decorator';
import { UserAccessEntity } from '../user-access/user-access.entity';
import { User } from '../user/user.decorator';
import { ProfileUpdateSanitizer } from './pipes/profile-update.sanitizer';
import { ProfileEntity } from './profile.entity';
import { ProfileService } from './profile.service';

@Crud({
  model: { type: ProfileEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  routes: { only: [
    'getOneBase',
    'getManyBase',
  ] },
})
@Controller('profile')
@ApiTags('profile')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class ProfileController {
  constructor(
    private service: ProfileService,
    private authService: AuthService,
    @InjectQueue('profile') private readonly profileQueue: Queue
  ) {
    this.createAdminUser();
  }

  private async createAdminUser() {
    const count = await ProfileEntity.count({});

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

  @Patch('/:id/review')
  @UserAccess(UserAccessFields.EditUserAccess)
  @UseGuards(UserAccessGuard)
  async reviewProfile(@Param('id') profileId: string, @Body() review: ProfileReview) {
    const profile = await ProfileEntity.findOneOrFail(profileId);

    await getManager()
      .transaction(async transactionalEntityManager => {
        if (review.roles || review.status) {
          const newInfo: Partial<Profile> = {};

          if (review.roles) {
            newInfo.roles = review.roles;
          }

          if (review.status) {
            newInfo.status = review.status;
          }

          await transactionalEntityManager
            .update(
              ProfileEntity,
              { id: profileId },
              newInfo
            );
        }

        if (review.access) {
          await transactionalEntityManager
            .update(
              UserAccessEntity,
              { profileId: profileId },
              { access: review.access }
            );
        }

        if (review.requiredActionId) {
          await transactionalEntityManager
            .update(
              RequiredActionEntity,
              { id: review.requiredActionId },
              { status: RequiredActionStatus.Completed }
            );
        }
      });

    if (review.status === ProfileStatus.Approved && profile.status !== ProfileStatus.Approved) {
      this.profileQueue.add('profile-approved', { profileId });
    }

    await this.authService.logout(profileId);

    return {
      access: await UserAccessEntity.findOne({ profileId: profileId }),
      profile: await ProfileEntity.findOne(profileId),
      action: review.requiredActionId? await RequiredActionEntity.findOne(review.requiredActionId): undefined,
    };
  }

  @Patch('/:id')
  async updateProfileInfo(@User() user: JwtObject, @Param('id') id: string, @Body(new ProfileUpdateSanitizer()) profile: Partial<Profile>) {
    if (!user) {
      throw new UnauthorizedException('no user');
    }

    if (user.userId !== id && !user.access.access[UserAccessFields.EditUserProfile]) {
      throw new UnauthorizedException('wrong user');
    }

    const updatedProfile = ProfileEntity.create({
      id,
      ...profile,
    });

    if (user.status === ProfileStatus.Registration) {
      updatedProfile.status = ProfileStatus.PendingApproval;
      updatedProfile.expiresAt = null;

      await this.authService.logout(user.profileId);

      this.profileQueue.add('new-profile', { profileId: id });

      await getManager().transaction(async transactionalEntityManager => {
        const admins = await ProfileEntity.admins();

        const requiredActions = admins.map(admin => RequiredActionEntity.create ({
          actionableId: user.profileId,
          actionableType: 'ProfileEntity',
          assignedToId: admin.id,
          requiredActionType: RequiredActionType.ReviewNewUser,
          title: `Review ${user.email} account.`,
        }));

        await transactionalEntityManager.save(requiredActions);

        await ProfileEntity.save(updatedProfile);
      });
    } else {
      await ProfileEntity.save(updatedProfile);
    }

    return ProfileEntity.findOne(id);
  }

}
