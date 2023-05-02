import { InjectQueue } from '@nestjs/bull';
import {
  Controller, Delete, Param, Patch, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest
} from '@nestjsx/crud';
import { Queue } from 'bull';
import { AchievementEntity } from '../achievement/achievement.entity';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { Clinic } from '../types/clinic/clinic';
import { ClinicAttendeeNewJob } from '../types/clinic/clinic-attendee-new-job';
import { ProfileRole } from '../types/profile/profile-role';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { UserAccess } from '../user-access/user-access.decorator';
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
    @InjectQueue('clinic') private readonly clinicQueue: Queue) { }

  get base(): CrudController<Clinic> {
    return this;
  }

  @Override()
  @UserAccess(UserAccessFields.CreateClinic)
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Clinic, @User() user: JwtObject) {
    dto.created_by_id = user.profile_id;

    return this.base.createOneBase(req, dto);
  }

  @Override()
  @UserAccess(UserAccessFields.CreateClinic, UserAccessFields.EditClinic)
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Clinic) {
    delete dto.created_by_id;
    delete dto.created_by;

    return this.base.updateOneBase(req, dto);
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

      const attendee = await newAttendant.save();

      const job: ClinicAttendeeNewJob = {
        clinic_id,
        profile_id: attendee.attendant_id,
      };

      this.clinicQueue.add('new-attendee', job);
    }

    const clinic = await ClinicEntity.findOne({  where: { id: clinic_id } });

    return clinic;
  }

  @Delete('/:clinic_id/leave/:profile_id')
  async disenroll(@Param('clinic_id') clinic_id: string, @Param('profile_id') profile_id: string) {
    const enrollment = await ClinicAttendanceEntity.findOne({ where: {
      clinic_id,
      attendant_id: profile_id,
    } });

    if (enrollment) {
      await enrollment.remove();
    }

    const clinic = await ClinicEntity.findOne({  where: { id: clinic_id } });

    return clinic;
  }

  @Delete('/:clinic_id/remove-user/:profile_id')
  async removeUser(
  @User() user: JwtObject,
    @Param('clinic_id') clinic_id: string,
    @Param('profile_id') profile_id: string) {
    const enrollment = await ClinicAttendanceEntity.findOne( {
      where: {
        clinic_id,
        attendant_id: profile_id,
      },
      relations: ['clinic'],
    });

    if (enrollment) {
      const clinic = enrollment.clinic;

      if (!user.roles.includes(ProfileRole.Admin) && clinic.instructor_id !== user.profile_id) {
        throw new UnauthorizedException();
      }

      await enrollment.remove();
    }

    const clinic = await ClinicEntity.findOne({  where: { id: clinic_id } });

    return clinic;
  }

  @Patch(':clinic_id/graduate-user/:profile_id')
  async graduateUseFromClinic(
  @User() user: JwtObject,
    @Param('clinic_id') clinic_id: string,
    @Param('profile_id') profile_id: string) {
    const enrollment = await ClinicAttendanceEntity.findOne( {
      where: {
        clinic_id,
        attendant_id: profile_id,
      },
      relations: ['clinic'],
    });

    if (enrollment) {
      const clinic = enrollment.clinic;

      if (!user.roles.includes(ProfileRole.Admin) && clinic.instructor_id !== user.profile_id) {
        throw new UnauthorizedException();
      }

      await this.service.repository.manager.transaction(async transactionalEntityManager => {
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

    return ClinicEntity.findOne({  where: { id: clinic_id } });
  }
}
