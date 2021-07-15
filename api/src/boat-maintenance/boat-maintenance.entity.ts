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

@Entity('boat-maintenance')
export class BoatMaintenanceEntity extends BaseModelEntity implements BoatMaintenance {
  @OneToMany(() => CommentEntity, (comment) => comment.boatMaintenance, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
  comments: CommentEntity[];

  @Column({
    default: BoatMaintenanceEntity.name,
    nullable: false,
  })
  entityType: string;

  @Column()
  requestDetails: string;

  @Column({
    nullable: true,
    default: null,
  })
  serviceDetails: string;

  @Column(
    {
      nullable: true,
      default: null,
    }
  )
  servicedAt: Date;

  @Column()
  requestedById: string;

  @Column(
    {
      nullable: true,
      default: null,
    }
  )
  resolutionDetails: string;

  @Column(
    {
      nullable: true,
      default: null,
    }
  )
  resolvedById: string;

  @Column({
    default: BoatMaintenanceStatus.New,
    enum: BoatMaintenanceStatus,
    type: 'enum',
    nullable: false,
  })
  @Index('boat_maintenance_status')
  status: BoatMaintenanceStatus;

  @Column()
  boatId: string;

  @Column(
    {
      nullable: true,
      default: null,
    }
  )
  sailId: string;

  @ManyToOne(() => SailEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({
    name: 'sailId',
    referencedColumnName: 'id',
  })
  sail: SailEntity

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'requestedById',
    referencedColumnName: 'id',
  })
  requestedBy: ProfileEntity;

  @ManyToOne(() => BoatEntity, { eager: true })
  @JoinColumn({
    name: 'boatId',
    referencedColumnName: 'id',
  })
  boat: BoatEntity

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'resolvedById',
    referencedColumnName: 'id',
  })
  resolvedBy: Profile;

  @OneToMany(() => MediaEntity, (picture) => picture.boatMaintenance, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
  pictures: MediaEntity[];

}
