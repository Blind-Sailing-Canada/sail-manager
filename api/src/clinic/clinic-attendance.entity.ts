import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { ClinicEntity } from './clinic.entity';
import { ClinicAttendance } from '../types/clinic/clinic-attendance';

@Entity('clinic_attendances')
export class ClinicAttendanceEntity extends BaseModelEntity implements ClinicAttendance {
  @Column({ type: 'uuid' })
    clinic_id: string;

  @Column({ type: 'uuid' })
    attendant_id: string;

  @Column({
    nullable: true,
    default: null,
    type: 'timestamptz',
  })
    finished_at: Date;

  @Column({
    nullable: true,
    default: null,
  })
    note: string;

  @ManyToOne(() => ClinicEntity)
    clinic: ClinicEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'attendant_id',
    referencedColumnName: 'id',
  })
    attendant: ProfileEntity;
}
