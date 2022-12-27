import { Base } from '../base/base';
import { ProductPurchase } from '../product-purchase/product-purchase';
import { Profile } from '../profile/profile';
import { Sail } from '../sail/sail';

export interface SailPaymentClaim extends Base {
  guest_email: string;
  guest_name: string;
  product_purchase: ProductPurchase;
  product_purchase_id: string;
  profile: Profile;
  profile_id: string;
  sail: Sail;
  sail_id: string;
}
