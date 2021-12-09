import { InjectQueue } from '@nestjs/bull';
import {
  Body,
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
  ] },
})
@Controller('clinic')
@ApiTags('clinic')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class ClinicController {

  constructor(
    public service: ClinicService,
    @InjectQueue('clinic') private readonly clinicQueue: Queue) { }

  @Patch('/:clinic_id')
  async update(@Param('clinic_id') id: string, @Body() body) {
    const result = await ClinicEntity.update(id, body);

    if (result.affected !== 1) {
      throw new Error(`Failed to update Clinic (${id})`);
    }

    return ClinicEntity.findOneOrFail(id);
  }

  @Patch('/:clinic_id/enroll/:profile_id')
  async enroll(@Param('clinic_id') clinic_id: string, @Param('profile_id') profile_id: string) {
    const count = await ClinicAttendanceEntity.count({ where: {
      clinic_id,
      attendant_id: profile_id,
    } });

    if (!count) {
      const newAttendant = ClinicAttendanceEntity.create({
        clinic_id,
        attendant_id: profile_id,
      });

      await newAttendant
        .save()
        .then(() => this.clinicQueue.add('new-attendee', {
          clinic_id,
          profile_id,
        }));
    }

    const clinic = await ClinicEntity.findOne({  id: clinic_id });

    return clinic;
  }

  @Delete('/:clinic_id/leave/:profile_id')
  async disenroll(@Param('clinic_id') clinic_id: string, @Param('profile_id') profile_id: string) {
    const enrollment = await ClinicAttendanceEntity.findOne({
      clinic_id,
      attendant_id: profile_id,
    });

    if (enrollment) {
      await enrollment.remove();
    }

    const clinic = await ClinicEntity.findOne({  id: clinic_id });

    return clinic;
  }

  @Delete('/:clinic_id/remove-user/:profile_id')
  async removeUser(@User() user: JwtObject, @Param('clinic_id') clinic_id: string, @Param('profile_id') profile_id: string) {
    const enrollment = await ClinicAttendanceEntity.findOne({
      clinic_id,
      attendant_id: profile_id,
    }, { relations: ['clinic'] });

    if (enrollment) {
      const clinic = enrollment.clinic;

      if (!user.roles.includes[ProfileRole.Admin] && clinic.instructor_id !== user.profile_id) {
        throw new UnauthorizedException();
      }

      await enrollment.remove();
    }

    const clinic = await ClinicEntity.findOne({  id: clinic_id });

    return clinic;
  }

  @Patch(':clinic_id/graduate-user/:profile_id')
  async graduateUseFromClinic(@User() user: JwtObject, @Param('clinic_id') clinic_id: string, @Param('profile_id') profile_id: string) {
    const enrollment = await ClinicAttendanceEntity.findOne({
      clinic_id,
      attendant_id: profile_id,
    }, { relations: ['clinic'] });

    if (enrollment) {
      const clinic = enrollment.clinic;

      if (!user.roles.includes[ProfileRole.Admin] && clinic.instructor_id !== user.profile_id) {
        throw new UnauthorizedException();
      }

      await getConnection().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.remove(enrollment);

        const newAchievement = AchievementEntity.create({
          profile_id: profile_id,
          achievement_id: clinic_id,
          name: clinic.name,
          description: `Completed ${clinic.name} clinic.`,
          badge: clinic.badge,
        });

        await transactionalEntityManager.save(newAchievement);
      });

    }

    return ClinicEntity.findOne({  id: clinic_id });
  }
}
