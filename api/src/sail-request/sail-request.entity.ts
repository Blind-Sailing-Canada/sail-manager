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

@Entity('sail-request')
export class SailRequestEntity extends BaseModelEntity implements SailRequest {
  @Column({
    nullable: true,
    unique: true,
  })
  entityNumber: number;

  @Column()
  details: string;

  @Column({ nullable: true })
  @Index()
  sailId: string;

  @Column({
    default: SailRequestStatus.New,
    enum: SailRequestStatus,
    type: 'enum',
    nullable: false,
  })
  status: SailRequestStatus;

  @ManyToOne(() => SailEntity, sail => sail.sailRequest, { eager: true })
  @JoinColumn()
  sail: SailEntity

  @Column()
  @Index()
  requestedById: string;

  @ManyToOne(() => ProfileEntity, undefined, { eager: true })
  @JoinColumn()
  requestedBy: ProfileEntity;

  @OneToMany(() => SailRequestInterestEntity, (interest) => interest.sailRequest, { eager: true })
  interest: SailRequestInterestEntity[];

  @AfterInsert()
  createInterest() {
    SailRequestInterestEntity.create({
      profileId: this.requestedById,
      sailRequestId: this.id,
    }).save();
  }

  @BeforeInsert()
  async addEntityNumber() {
    const tableName = `"${SailRequestEntity.getRepository().metadata.tableName}"`;

    const entityNumber = await SailRequestEntity
      .getRepository()
      .createQueryBuilder(tableName)
      .select(`MAX(${tableName}.entityNumber)`, 'max')
      .getRawOne();

    this.entityNumber = entityNumber.max + 1;
  }
}
