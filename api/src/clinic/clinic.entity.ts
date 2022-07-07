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
import { DocumentEntity } from '../document/document.entity';

@Entity('clinics')
export class ClinicEntity extends BaseModelEntity implements Clinic {
  @Column({
    length: 100,
    unique: true,
    nullable: false,
  })
  @Index('clinics_name')
    name: string;

  @Column({
    default: ClinicEntity.name,
    nullable: false,
  })
    entity_type: string;

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
    max_occupancy: number;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
    start_date: Date;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
    end_date: Date;

  @Column({
    nullable: true,
    default: null,
    type: 'uuid'
  })
    instructor_id: string;

  @OneToOne(() => ProfileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'instructor_id',
    referencedColumnName: 'id'
  })
    instructor: ProfileEntity;

  @OneToMany(() => ClinicAttendanceEntity, attendance => attendance.clinic, { eager: true })
    attendance: ClinicAttendanceEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.clinic, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
    documents: DocumentEntity[];
}
