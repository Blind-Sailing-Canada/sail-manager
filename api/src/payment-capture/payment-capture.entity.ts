import { Exclude } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProductPurchaseEntity } from '../product-purchase/product-purchase.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { PaymentCapture } from '../types/payment-capture/payment-capture';
import { ProductPurchase } from '../types/product-purchase/product-purchase';
import { ProductType } from '../types/product-purchase/product-type';
import { Profile } from '../types/profile/profile';

@Entity('payment_captures')
export class PaymentCaptureEntity extends BaseModelEntity implements PaymentCapture {

  @Column({
    nullable: false,
    length: 500,
  })
    customer_email: string;

  @Column({
    nullable: false,
    length: 500,
  })
    customer_name: string;

  @Column({ type: 'jsonb' })
  @Exclude()
    data: Record<string, any>;

  @Column({ length: 100 })
    payment_processor: string;

  @Column({ length: 150 })
    product_name: string;

  @Column({
    type: 'int',
    default: 1,
  })
    product_quantity: number;

  @Column({
    enum: ProductType,
    type: 'enum',
    nullable: false,
  })
    product_type: ProductType;

  @ManyToOne(() => ProfileEntity, {
    eager: true,
    nullable: true,
  })
    profile: Profile;

  @Column({
    nullable: true,
    default: null,
    type: 'uuid'
  })
    profile_id: string;

  @DeleteDateColumn()
    deleted_at?: Date;

  @OneToOne(() => ProductPurchaseEntity)
  @JoinColumn([
    {
      name: 'id',
      referencedColumnName: 'payment_capture_id',
    },
  ])
    product_purchase: ProductPurchase;
}
