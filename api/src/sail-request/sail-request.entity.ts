import {
  AfterInsert,
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailRequestInterestEntity } from '../sail-request-interest/sail-request-interest.entity';
import { SailEntity } from '../sail/sail.entity';
import { SailRequest } from '../types/sail-request/sail-request';
import { SailRequestStatus } from '../types/sail-request/sail-request-status';

@Entity('sail_requests')
export class SailRequestEntity extends BaseModelEntity implements SailRequest {
  @Column({
    nullable: true,
    unique: true,
  })
    entity_number: number;

  @Column()
    category: string;

  @Column()
    details: string;

  @Column({
    nullable: true,
    type: 'uuid'
  })
  @Index()
    sail_id: string;

  @Column({
    default: SailRequestStatus.New,
    enum: SailRequestStatus,
    type: 'enum',
    nullable: false,
  })
    status: SailRequestStatus;

  @ManyToOne(() => SailEntity, sail => sail.sail_request, { eager: true })
  @JoinColumn({
    name: 'sail_id',
    referencedColumnName: 'id',
  })
    sail: SailEntity;

  @Column({ type: 'uuid' })
  @Index()
    requested_by_id: string;

  @ManyToOne(() => ProfileEntity, undefined, { eager: true })
  @JoinColumn({
    name: 'requested_by_id',
    referencedColumnName: 'id',
  })
    requested_by: ProfileEntity;

  @OneToMany(() => SailRequestInterestEntity, (interest) => interest.sail_request, { eager: true })
    interest: SailRequestInterestEntity[];

  @AfterInsert()
  createInterest() {
    SailRequestInterestEntity.create({
      profile_id: this.requested_by_id,
      sail_request_id: this.id,
    }).save();
  }

  @BeforeInsert()
  async addEntityNumber() {
    const tableName = `${SailRequestEntity.getRepository().metadata.tableName}`;

    const entity_number = await SailRequestEntity
      .getRepository()
      .createQueryBuilder(tableName)
      .select(`MAX(${tableName}.entity_number)`, 'max')
      .getRawOne();

    this.entity_number = entity_number.max + 1;
  }
}
