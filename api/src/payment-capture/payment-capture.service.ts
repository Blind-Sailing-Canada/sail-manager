import {
  DataSource, Repository
} from 'typeorm';
import {
  BadRequestException, Injectable
} from '@nestjs/common';
import {
  InjectDataSource, InjectRepository
} from '@nestjs/typeorm';
import { PaymentCaptureEntity } from './payment-capture.entity';
import { BaseService } from '../base/base.service';
import { ProductPurchaseEntity } from '../product-purchase/product-purchase.entity';
import { ManualCredit } from '../types/payment-capture/manual-credit';
import { ProductType } from '../types/product-purchase/product-type';

@Injectable()
export class PaymentCaptureService extends BaseService<PaymentCaptureEntity> {
  public dataSource: DataSource;

  constructor(
  @InjectDataSource() dataSource: DataSource,
    @InjectRepository(PaymentCaptureEntity) repo: Repository<PaymentCaptureEntity>) {
    super(repo);
    this.dataSource = dataSource;
  }

  async assignToProfile(capture_id: string, profile_id: string) {
    const payment = await PaymentCaptureEntity.findOneByOrFail({ id: capture_id });

    if (payment.profile_id) {
      throw new BadRequestException('payment already assigned to a user');
    }

    return await this.repository.manager.transaction(async transactionalEntityManager => {
      let product: ProductPurchaseEntity;

      switch(payment.payment_processor) {
        case 'stripe':
          product = this.getStripeProduct(payment);
          break;
        case 'manual':
          product = this.getManulProduct(payment);
          break;
      }

      product.profile_id = profile_id;

      await transactionalEntityManager.save(product);

      payment.profile_id = profile_id;

      await transactionalEntityManager.save(payment);
    });
  }

  private getManulProduct(payment: PaymentCaptureEntity): ProductPurchaseEntity {
    const quantity = payment.product_quantity || 1;
    const data: ManualCredit = payment.data as ManualCredit;

    const product = new ProductPurchaseEntity();

    product.is_unlimited_sails = data.is_unlimited_sails ?? false;
    product.number_of_guest_sails_included = quantity * (data.number_of_guest_sails_included ?? 0);
    product.number_of_sails_included = quantity * (data.number_of_sails_included ?? 0);
    product.payment_capture_id = payment.id;
    product.product_name = payment.product_name;
    product.product_type = data.product_type ?? ProductType.UNKNOWN;
    product.valid_until = data.valid_until ?? null;
    product.is_manual_credit = true;
    product.note = data.note ?? 'manual credit';

    return product;
  }

  private getStripeProduct(payment: PaymentCaptureEntity): ProductPurchaseEntity {
    const quantity = payment.product_quantity || 1;
    const data = payment.data;

    const product = new ProductPurchaseEntity();

    product.is_unlimited_sails = this.extractStripeField<string>(data, 'is_unlimited_sails', 'false') === 'true';
    product.number_of_guest_sails_included = quantity * this.extractStripeField(data, 'number_of_guest_sails_included', 0);
    product.number_of_sails_included = quantity * this.extractStripeField(data, 'number_of_sails_included', 0);
    product.payment_capture_id = payment.id;
    product.product_name = payment.product_name;
    product.product_type = this.extractStripeField<ProductType>(data, 'product_type', ProductType.UNKNOWN);
    product.valid_until = this.extractStripeField<Date>(data, 'valid_until', null);

    return product;
  }

  private extractStripeField<T>(data: any, field: string, defaultValue: T): T {
    return (data.metadata[field] ?? data.line_items?.data[0]?.price?.product?.metadata[field]) || defaultValue;
  }

}
