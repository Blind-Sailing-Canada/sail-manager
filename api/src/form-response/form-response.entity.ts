import {
  Column,
  Entity,
  Index,
  ManyToOne,
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { FormResponse } from '../types/form-response/form-response';

@Entity('form_responses')
export class FormResponseEntity extends BaseModelEntity implements FormResponse {
  @Column()
  @Index()
    email: string;

  @Column()
  @Index()
    name: string;

  @Column({
    nullable: true,
    default: null,
  })
  @Index()
    profile_id: string;

  @Column()
  @Index()
    form_name: string;

  @Column()
    form_id: string;

  @Column()
    response: string;

  @ManyToOne(() => ProfileEntity, (profile) => profile.form_responses)
    profile: ProfileEntity;
}
