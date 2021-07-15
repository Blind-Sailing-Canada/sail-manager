import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ClinicAttendanceEntity } from './clinic-attendance.entity';
import { Clinic } from '../types/clinic/clinic';
import { ClinicStatus } from '../types/clinic/clinic-status';
import { ProfileEntity } from '../profile/profile.entity';

@Entity('clinic')
export class ClinicEntity extends BaseModelEntity implements Clinic {
  @Column({
    length: 100,
    unique: true,
    nullable: false,
  })
  @Index('clinic_name')
  name: string;

  @Column()
  description: string;

  @Column()
  badge: string;

  @Column({
    default: ClinicStatus.New,
    enum: ClinicStatus,
    type: 'enum',
    nullable: false,
  })
  @Index('clinic_status')
  status: ClinicStatus;

  @Column({ default: 0 })
  maxOccupancy: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({
    nullable: true,
    default: null,
  })
  instructorId: string;

  @OneToOne(() => ProfileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  instructor: ProfileEntity;

  @OneToMany(() => ClinicAttendanceEntity, attendance => attendance.clinic, { eager: true })
  attendance: ClinicAttendanceEntity[];
}
