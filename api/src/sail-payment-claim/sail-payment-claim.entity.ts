import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProductPurchaseEntity } from '../product-purchase/product-purchase.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { ProductPurchase } from '../types/product-purchase/product-purchase';
import { Profile } from '../types/profile/profile';
import { SailPaymentClaim } from '../types/sail-payment-claim/sail-payment-claim';
import { Sail } from '../types/sail/sail';

@Entity('sail_payment_claims')
export class SailPaymentClaimEntity extends BaseModelEntity implements SailPaymentClaim {

  @ManyToOne(() => ProductPurchaseEntity)
    product_purchase: ProductPurchase;

  @Column({
    type: 'uuid',
    nullable: true
  })
    product_purchase_id: string;

  @ManyToOne(() => SailEntity)
    sail: Sail;

  @Column({ type: 'uuid' })
    sail_id: string;

  @Column({
    length: 150,
    nullable: true,
    default: null
  })
    guest_name: string;

  @Column({
    length: 150,
    nullable: true,
    default: null
  })
    guest_email: string;

  @ManyToOne(() => ProfileEntity, {
    eager: true,
    nullable: true
  })
    profile: Profile;

  @Column({
    type: 'uuid',
    nullable: true,
  })
    profile_id: string;

  @DeleteDateColumn()
    deleted_at?: Date;

}
