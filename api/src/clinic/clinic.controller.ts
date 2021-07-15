import { InjectQueue } from '@nestjs/bull';
import {
  Controller, Delete, Param, Patch, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Queue } from 'bull';
import { getConnection } from 'typeorm';
import { AchievementEntity } from '../achievement/achievement.entity';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileRole } from '../types/profile/profile-role';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { ClinicAttendanceEntity } from './clinic-attendance.entity';
import { ClinicEntity } from './clinic.entity';
import { ClinicService } from './clinic.service';

@Crud({
  model: { type: ClinicEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: { join: {
    instructor: { eager: true },
    attendance: { eager: true },
    'attendance.attendant': { eager: true },
  } },
  routes: { only: [
    'createOneBase',
    'getManyBase',
    'getOneBase',
    'updateOneBase',
  ] },
})
@Controller('clinic')
@ApiTags('clinic')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class ClinicController {

  constructor(
    public service: ClinicService,
    @InjectQueue('clinic') private readonly cliniQueue: Queue) { }

  @Patch('/:clinicId/enroll/:profileId')
  async enroll(@Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const count = await ClinicAttendanceEntity.count({ where: {
      clinicId,
      attendantId: profileId,
    } });

    if (!count) {
      const newAttendant = ClinicAttendanceEntity.create({
        clinicId,
        attendantId: profileId,
      });

      await newAttendant
        .save()
        .then(() => this.cliniQueue.add('new-attendee', {
          clinicId,
          profileId,
        }));
    }

    const clinic = await ClinicEntity.findOne({  id: clinicId });

    return clinic;
  }

  @Delete('/:clinicId/leave/:profileId')
  async disenroll(@Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const enrollment = await ClinicAttendanceEntity.findOne({
      clinicId,
      attendantId: profileId,
    });

    if (enrollment) {
      await enrollment.remove();
    }

    const clinic = await ClinicEntity.findOne({  id: clinicId });

    return clinic;
  }

  @Delete('/:clinicId/remove-user/:profileId')
  async removeUser(@User() user: JwtObject, @Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const enrollment = await ClinicAttendanceEntity.findOne({
      clinicId,
      attendantId: profileId,
    }, { relations: ['clinic'] });

    if (enrollment) {
      const clinic = enrollment.clinic;

      if (!user.roles.includes[ProfileRole.Admin] && clinic.instructorId !== user.profileId) {
        throw new UnauthorizedException();
      }

      await enrollment.remove();
    }

    const clinic = await ClinicEntity.findOne({  id: clinicId });

    return clinic;
  }

  @Patch(':clinicId/graduate-user/:profileId')
  async graduateUseFromClinic(@User() user: JwtObject, @Param('clinicId') clinicId: string, @Param('profileId') profileId: string) {
    const enrollment = await ClinicAttendanceEntity.findOne({
      clinicId,
      attendantId: profileId,
    }, { relations: ['clinic'] });

    if (enrollment) {
      const clinic = enrollment.clinic;

      if (!user.roles.includes[ProfileRole.Admin] && clinic.instructorId !== user.profileId) {
        throw new UnauthorizedException();
      }

      await getConnection().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.remove(enrollment);

        const newAchievement = AchievementEntity.create({
          profileId: profileId,
          achievementId: clinicId,
          name: clinic.name,
          description: `Completed ${clinic.name} clinic.`,
          badge: clinic.badge,
        });

        await transactionalEntityManager.save(newAchievement);
      });

    }

    return ClinicEntity.findOne({  id: clinicId });
  }
}
