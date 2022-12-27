import { Base } from '../base/base';
import { ProductPurchase } from '../product-purchase/product-purchase';
import { ProductType } from '../product-purchase/product-type';
import { Profile } from '../profile/profile';

export interface PaymentCapture extends Base {
  customer_email: string;
  customer_name: string;
  data: Record<string, any>;
  payment_processor: string;
  product_name: string;
  product_purchase: ProductPurchase;
  product_quantity: number;
  product_type: ProductType;
  profile: Profile;
  profile_id: string;
}
