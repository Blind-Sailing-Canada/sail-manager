import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne
} from 'typeorm';
import { AchievementEntity } from '../achievement/achievement.entity';
import { ExpiresBaseModelEntity } from '../base/expires-base.entity';
import { ChallengeParticipantEntity } from '../challenge/challenge-participant.entity';
import { ClinicAttendanceEntity } from '../clinic/clinic-attendance.entity';
import { RequiredActionEntity } from '../required-action/required-action.entity';
import { SailChecklistEntity } from '../sail-checklist/sail-checklist.entity';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { Profile } from '../types/profile/profile';
import { ProfileRole } from '../types/profile/profile-role';
import { ProfileStatus } from '../types/profile/profile-status';
import { UserAccessEntity } from '../user-access/user-access.entity';

@Entity('profiles')
export class ProfileEntity extends ExpiresBaseModelEntity implements Profile {
  @Column({ length: 100 })
  @Index('profile_name')
  name: string;

  @Column({
    default: '',
    nullable: true,
  })
  photo: string;

  @Column({
    length: 500,
    unique: true,
  })
  @Index('profile_email')
  email: string;

  @Column({
    length: 10,
    default: '',
  })
  @Index('profile_phone')
  phone: string;

  @Column({
    length: 500,
    default: '',
  })
  bio: string;

  @Column({
    default: ProfileStatus.Registration,
    enum: ProfileStatus,
    type: 'enum',
    nullable: false,
  })
  @Index()
  status: ProfileStatus

  @Column({
    nullable: true,
    default: null,
    type: 'timestamptz',
  })
  expires_at: Date;

  @Column({
    array: false,
    default: [],
    nullable: false,
    type: 'jsonb',
  })
  roles: ProfileRole[];

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => UserAccessEntity, (access) => access.profile, { eager: true })
  access: UserAccessEntity;

  @OneToMany(() => AchievementEntity, (achievements) => achievements.profile, { eager: true })
  achievements: AchievementEntity[]

  @OneToMany(() => SailManifestEntity, (sailManifest) => sailManifest.profile)
  sail_manifests: SailManifestEntity[]

  @OneToMany(() => RequiredActionEntity, (requiredAction) => requiredAction.assigned_to)
  required_actions: RequiredActionEntity[]

  @OneToMany(() => ClinicAttendanceEntity, (clinicAttendance) => clinicAttendance.attendant)
  clinics_attendances: ClinicAttendanceEntity[]

  @OneToMany(() => ChallengeParticipantEntity, (challenge) => challenge.participant)
  challenges: ChallengeParticipantEntity[]

  @OneToMany(() => SailChecklistEntity, (checklist) => checklist.submitted_by)
  sail_checklists: SailChecklistEntity[]

  static coordinators(): Promise<ProfileEntity[]> {
    return ProfileEntity
      .find({ where: `status='${ProfileStatus.Approved}' AND roles ? '${ProfileRole.Coordinator}' = true` });
  }

  static admins(): Promise<ProfileEntity[]> {
    return ProfileEntity
      .find({ where: `status='${ProfileStatus.Approved}' AND roles ? '${ProfileRole.Admin}' = true` });
  }

  static fleetManager(): Promise<ProfileEntity> {
    return ProfileEntity
      .findOne({ where: `status='${ProfileStatus.Approved}' AND roles ? '${ProfileRole.FleetManager}' = true` });
  }
}
