import {
  ArrayContains,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AchievementEntity } from '../achievement/achievement.entity';
import { ExpiresBaseModelEntity } from '../base/expires-base.entity';
import { ChallengeParticipantEntity } from '../challenge/challenge-participant.entity';
import { ClinicAttendanceEntity } from '../clinic/clinic-attendance.entity';
import { FormResponseEntity } from '../form-response/form-response.entity';
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
  @Index('profile_name', {
    unique: true,
    where: 'deleted_at IS NULL'
  })
    name: string;

  @Column({
    default: '',
    nullable: true,
  })
    photo: string;

  @Column({ length: 500 })
  @Index('profile_email', {
    unique: true,
    where: 'deleted_at IS NULL'
  })
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
    status: ProfileStatus;

  @Column({
    nullable: true,
    default: null,
    type: 'timestamptz',
  })
    expires_at: Date;

  @Column('text', {
    array: true,
    default: '{}',
  })
    roles: ProfileRole[];

  @Column({
    nullable: true,
    default: null,
    type: 'timestamptz',
  })
  @Index()
    last_login: Date;

  @DeleteDateColumn()
    deleted_at: Date;

  @OneToOne(() => UserAccessEntity, (access) => access.profile, { eager: false })
    access: UserAccessEntity;

  @OneToMany(() => AchievementEntity, (achievements) => achievements.profile, { eager: false })
    achievements: AchievementEntity[];

  @OneToMany(() => FormResponseEntity, (form_responses) => form_responses.profile, { eager: false })
    form_responses: FormResponseEntity[];

  @OneToMany(() => SailManifestEntity, (sailManifest) => sailManifest.profile, { eager: false })
    sail_manifests: SailManifestEntity[];

  @OneToMany(() => RequiredActionEntity, (requiredAction) => requiredAction.assigned_to, { eager: false })
    required_actions: RequiredActionEntity[];

  @OneToMany(() => ClinicAttendanceEntity, (clinicAttendance) => clinicAttendance.attendant, { eager: false })
    clinics_attendances: ClinicAttendanceEntity[];

  @OneToMany(() => ChallengeParticipantEntity, (challenge) => challenge.participant, { eager: false })
    challenges: ChallengeParticipantEntity[];

  @OneToMany(() => SailChecklistEntity, (checklist) => checklist.submitted_by, { eager: false })
    sail_checklists: SailChecklistEntity[];

  static coordinators(): Promise<ProfileEntity[]> {
    return ProfileEntity.find({ where: {
      status: ProfileStatus.Approved,
      roles: ArrayContains([ProfileRole.Coordinator]),
    } });

  }

  static async admins(): Promise<ProfileEntity[]> {
    const foo = await ProfileEntity.find({ where: {
      status: ProfileStatus.Approved,
      roles: ArrayContains([ProfileRole.Admin]),
    } });

    return foo;
  }

  static fleetManagers(): Promise<ProfileEntity[]> {
    return ProfileEntity.find({ where: {
      status: ProfileStatus.Approved,
      roles: ArrayContains([ProfileRole.FleetManager]),
    } });
  }
}
