import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatEntity } from '../boat/boat.entity';
import { CommentEntity } from '../comment/comment.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { Profile } from '../types/profile/profile';
import { SailEntity } from '../sail/sail.entity';
import { BoatMaintenance } from '../types/boat-maintenance/boat-maintenance';
import { BoatMaintenanceStatus } from '../types/boat-maintenance/boat-maintenance-status';
import { MediaEntity } from '../media/media.entity';

@Entity('boat_maintenances')
export class BoatMaintenanceEntity extends BaseModelEntity implements BoatMaintenance {
  @OneToMany(() => CommentEntity, (comment) => comment.boat_maintenance, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
    comments: CommentEntity[];

  @Column({
    default: BoatMaintenanceEntity.name,
    nullable: false,
  })
    entity_type: string;

  @Column()
    request_details: string;

  @Column({
    nullable: true,
    default: null,
  })
    service_details: string;

  @Column({
    nullable: true,
    default: null,
    type: 'timestamptz',
  })
    serviced_at: Date;

  @Column({ type: 'uuid' })
    requested_by_id: string;

  @Column(
    {
      nullable: true,
      default: null,
    }
  )
    resolution_details: string;

  @Column(
    {
      nullable: true,
      default: null,
      type: 'uuid'
    }
  )
    resolved_by_id: string;

  @Column({
    default: BoatMaintenanceStatus.New,
    enum: BoatMaintenanceStatus,
    type: 'enum',
    nullable: false,
  })
  @Index('boat_maintenance_status')
    status: BoatMaintenanceStatus;

  @Column({ type: 'uuid' })
    boat_id: string;

  @Column(
    {
      nullable: true,
      default: null,
      type: 'uuid'
    }
  )
    sail_id: string;

  @ManyToOne(() => SailEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({
    name: 'sail_id',
    referencedColumnName: 'id',
  })
    sail: SailEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'requested_by_id',
    referencedColumnName: 'id',
  })
    requested_by: ProfileEntity;

  @ManyToOne(() => BoatEntity, { eager: true })
  @JoinColumn({
    name: 'boat_id',
    referencedColumnName: 'id',
  })
    boat: BoatEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'resolved_by_id',
    referencedColumnName: 'id',
  })
    resolved_by: Profile;

  @OneToMany(() => MediaEntity, (picture) => picture.boatMaintenance, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
    pictures: MediaEntity[];

}
