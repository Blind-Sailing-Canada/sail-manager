import { Base } from '../base/base';
import { PaymentCapture } from '../payment-capture/payment-capture';
import { Profile } from '../profile/profile';
import { ProductType } from './product-type';

export interface ProductPurchase extends Base {
  credited_by: Profile;
  credited_by_id: string;
  is_exhausted: boolean;
  is_unlimited_sails: boolean;
  is_manual_credit: boolean;
  note: string;
  number_of_sails_included: number;
  number_of_sails_used: number;
  number_of_guest_sails_included: number;
  number_of_guest_sails_used: number;
  payment_capture: PaymentCapture;
  payment_capture_id: string;
  product_name: string;
  product_type: ProductType;
  profile: Profile;
  profile_id: string;
  valid_until: Date;
}
