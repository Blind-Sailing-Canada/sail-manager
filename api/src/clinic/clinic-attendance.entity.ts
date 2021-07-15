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

@Entity('clinic-attendance')
export class ClinicAttendanceEntity extends BaseModelEntity implements ClinicAttendance {
  @Column()
  clinicId: string;

  @Column()
  attendantId: string;

  @Column({
    nullable: true,
    default: null,
  })
  finishedAt: Date;

  @Column({
    nullable: true,
    default: null,
  })
  note: string;

  @ManyToOne(() => ClinicEntity)
  clinic: ClinicEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'attendantId',
    referencedColumnName: 'id',
  })
  attendant: ProfileEntity;
}
