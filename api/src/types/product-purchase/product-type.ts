import { titlize } from '../../utils/strings';

export enum ProductType {
  GUEST_SAIL = 'guest_sail',
  MEMBERSHIP = 'membership',
  SAIL_PACKAGE = 'sail_package',
  SINGLE_SAIL = 'single_sail',
  DONATION = 'donation',
  UNKNOWN = 'unknown',
}

export const product_types = Object.values(ProductType).map(product_type => product_type.toString());
export const product_names = product_types
  .map(product_type => product_type.replace(/_/g, ' '))
  .map(product_name => titlize(product_name));

export const  product_type_name: Record<string, string> = Object.values(ProductType).reduce((red, product_type) => {
  red[product_type] = titlize(product_type.replace(/_/g, ' '));
  return red;
}, {});
