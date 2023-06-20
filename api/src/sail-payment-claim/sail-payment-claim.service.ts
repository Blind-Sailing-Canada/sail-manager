import {
  IsNull, Repository
} from 'typeorm';
import {
  Injectable, Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SailPaymentClaimEntity } from './sail-payment-claim.entity';
import { BaseService } from '../base/base.service';
import { ProductPurchaseEntity } from '../product-purchase/product-purchase.entity';

@Injectable()
export class SailPaymentClaimService extends BaseService<SailPaymentClaimEntity> {
  private readonly logger = new Logger(SailPaymentClaimService.name);

  constructor(@InjectRepository(SailPaymentClaimEntity) repo: Repository<SailPaymentClaimEntity>) {
    super(repo);
  }

  public async exhaustSailProducts() {
    await await ProductPurchaseEntity
      .getRepository()
      .createQueryBuilder()
      .andWhere('number_of_guest_sails_included <= number_of_guest_sails_used')
      .andWhere('number_of_sails_included <= number_of_sails_used')
      .andWhere({ is_unlimited_sails: false })
      .cache(false)
      .update({ is_exhausted: true });
  }

  async linkAllClaimsToProfile() {
    const claims = await SailPaymentClaimEntity.find({ where: { product_purchase_id: IsNull() } });

    for(const claim of claims) {
      try {
        if (claim.guest_email) {
          await this.claimGuestSail(claim);
        } else {
          await this.claimMemberSail(claim);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  private async claimGuestSail(claim: SailPaymentClaimEntity) {
    const product = await ProductPurchaseEntity
      .getRepository()
      .createQueryBuilder()
      .where({ profile_id: claim.profile_id })
      .andWhere('number_of_guest_sails_included > number_of_guest_sails_used')
      .andWhere('(valid_until IS NULL OR valid_until > current_date)')
      .cache(false)
      .getOne();

    if (!product) {
      return;
    }

    this.repository.manager.transaction(async (transactionManager) => {
      product.number_of_guest_sails_used += 1;

      await transactionManager.save(product);

      claim.product_purchase_id = product.id;

      await transactionManager.save(claim);
    });
  }

  private async claimMemberSail(claim: SailPaymentClaimEntity) {
    let product: ProductPurchaseEntity;

    const expiringPoduct = await ProductPurchaseEntity
      .getRepository()
      .createQueryBuilder()
      .where({ profile_id: claim.profile_id })
      .andWhere('number_of_sails_included > number_of_sails_used')
      .andWhere('valid_until IS NOT NULL AND valid_until > current_date')
      .orderBy('valid_until', 'ASC')
      .cache(false)
      .getOne();

    product = expiringPoduct;

    if (!expiringPoduct) {
      const unlimitedProduct = await ProductPurchaseEntity
        .getRepository()
        .createQueryBuilder()
        .where({
          profile_id: claim.profile_id,
          is_unlimited_sails: true
        })
        .andWhere('(valid_until IS NULL OR valid_until > current_date)')
        .cache(false)
        .getOne();

      product = unlimitedProduct;
    }

    if (!product) {
      const individualProduct = await ProductPurchaseEntity
        .getRepository()
        .createQueryBuilder()
        .where({ profile_id: claim.profile_id })
        .andWhere('number_of_sails_included > number_of_sails_used')
        .andWhere('(valid_until IS NULL OR valid_until > current_date)')
        .cache(false)
        .getOne();

      product = individualProduct;
    }

    if (!product) {
      return;
    }

    this.repository.manager.transaction(async (transactionManager) => {
      product.number_of_sails_used += 1;

      await transactionManager.save(product);

      claim.product_purchase_id = product.id;

      await transactionManager.save(claim);
    });
  }
}
