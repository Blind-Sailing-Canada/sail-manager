import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { PaymentCaptureEntity } from '../payment-capture/payment-capture.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { PaymentCapture } from '../types/payment-capture/paymet-capture';
import { ProductPurchase } from '../types/product-purchase/product-purchase';
import { ProductType } from '../types/product-purchase/product-type';
import { Profile } from '../types/profile/profile';

@Entity('product_purchases')
export class ProductPurchaseEntity extends BaseModelEntity implements ProductPurchase {
  @ManyToOne(() => ProfileEntity, {
    eager: false,
    nullable: true,
  })
    credited_by: Profile;

  @Column({
    nullable: true,
    default: null,
    type: 'uuid'
  })
    credited_by_id: string;

  @Column({ default: false, })
    is_exhausted: boolean;

  @Column({ default: false, })
    is_unlimited_sails: boolean;

  @Column({ default: false })
    is_manual_credit: boolean;

  @Column({
    length: 500,
    nullable: true
  })
    note: string;

  @Column({
    type: 'int',
    default: 0
  })
    number_of_sails_included: number;

  @Column({
    type: 'int',
    default: 0
  })
    number_of_sails_used: number;

  @Column({
    type: 'int',
    default: 0
  })
    number_of_guest_sails_included: number;

  @Column({
    type: 'int',
    default: 0
  })
    number_of_guest_sails_used: number;

  @OneToOne(() => PaymentCaptureEntity)
    payment_capture: PaymentCapture;

  @Column({ type: 'uuid', })
    payment_capture_id: string;

  @Column({ length: 150 })
    product_name: string;

  @Column({
    enum: ProductType,
    type: 'enum',
    nullable: false,
  })
    product_type: ProductType;

  @ManyToOne(() => ProfileEntity, {
    eager: false,
    nullable: true
  })
    profile: Profile;

  @Column({
    type: 'uuid',
    nullable: true,
  })
    profile_id: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
    valid_until: Date;

  @DeleteDateColumn()
    deleted_at?: Date;

}
