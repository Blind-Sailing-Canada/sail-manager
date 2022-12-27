import { ProductType } from '../product-purchase/product-type';

export interface ManualCredit {
  customer_email: string;
  customer_name: string;
  is_unlimited_sails: boolean;
  note: string;
  number_of_guest_sails_included: number;
  number_of_sails_included: number;
  product_name: string;
  product_type: ProductType;
  valid_until: Date;
}
