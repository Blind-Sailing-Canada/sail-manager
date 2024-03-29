import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Param,
  Post,
  Delete,
  UseGuards,
  Patch
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserRoles } from '../guards/user-roles.decorator';
import { ProfileRole } from '../types/profile/profile-role';
import { Crud } from '@nestjsx/crud';
import { PaymentCaptureEntity } from './payment-capture.entity';
import { PaymentCaptureService } from './payment-capture.service';
import { User } from '../user/user.decorator';
import { JwtObject } from '../types/token/jwt-object';
import { ManualCredit } from '../types/payment-capture/manual-credit';
import { ProfileEntity } from '../profile/profile.entity';
import { PaymentCaptureEditGuard } from './payment-capture-edit.guard';
import { ProductPurchaseEntity } from '../product-purchase/product-purchase.entity';

interface ProfileData {
  profile_id: string
}

@Crud({
  model: { type: PaymentCaptureEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788,
    alwaysPaginate: true,
    join: {
      profile: { eager: true },
      product_purchase: { eager: true }
    }
  },
  routes: { only: [
    'getOneBase',
    'getManyBase',
  ] },
})
@Controller('payment-capture')
@ApiTags('payment-capture')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
@UserRoles(ProfileRole.Admin)
export class PaymentCaptureController {
  private logger: Logger;

  constructor(public service: PaymentCaptureService) {
    this.logger = new Logger(PaymentCaptureController.name);
  }

  @Patch('/:id')
  @UseGuards(PaymentCaptureEditGuard)
  async updatePayment(@Param('id') payment_id: string, @Body() payment_data: Partial<PaymentCaptureEntity>) {
    const updatedProduct = payment_data.product_purchase? ProductPurchaseEntity.create({ ...payment_data.product_purchase }): null;

    delete payment_data.product_purchase;

    payment_data.id = payment_id;

    const updatedPayment = PaymentCaptureEntity.create(payment_data);

    await PaymentCaptureEntity.getRepository().manager.transaction(async transactionalEntityManager => {
      if (updatedProduct?.id){
        await transactionalEntityManager.save(updatedProduct);
      }
      await transactionalEntityManager.save(updatedPayment);
    });

    return PaymentCaptureEntity.findOneOrFail({
      where: { id: payment_id },
      relations: ['product_purchase']
    });
  }

  @Delete('/:id')
  async deletePayment(@Param('id') payment_id: string) {
    const payment = await PaymentCaptureEntity.findOneOrFail({ where: { id: payment_id }, });
    const product = await ProductPurchaseEntity.findOne({ where: { payment_capture_id: payment.id } });

    await PaymentCaptureEntity.getRepository().manager.transaction(async transactionalEntityManager => {
      if (product){
        await transactionalEntityManager.softRemove(product);
      }
      await transactionalEntityManager.softRemove(payment);
    });
  }

  @Post('/manual_credit')
  async manualCreditPayment(@User() user: JwtObject, @Body() body: ManualCredit) {
    const paymentCapture = new PaymentCaptureEntity();

    paymentCapture.product_name = body.product_name;
    paymentCapture.product_quantity = 1;
    paymentCapture.payment_processor = 'manual';
    paymentCapture.product_type = body.product_type;
    paymentCapture.customer_email = body.customer_email.trim().toLowerCase();
    paymentCapture.customer_name = body.customer_name.trim();
    paymentCapture.data = {
      ...body,
      credited_by_id: user.profile_id
    };

    const customerProfile = await ProfileEntity.findOneBy({ email: paymentCapture.customer_email });

    const savedCapture = await paymentCapture.save();

    if (customerProfile) {
      await this.service
        .assignToProfile(savedCapture.id, customerProfile.id)
        .catch((error) => {
          this.logger.error(error);
        });
    }

    return savedCapture;
  }

  @Post('/:payment_id/assign')
  async assignToProfile(@Param('payment_id') payment_id: string, @Body() profileData: ProfileData) {
    if (!profileData?.profile_id) {
      throw new BadRequestException('profile_id is missing');
    }

    await this.service.assignToProfile(payment_id, profileData.profile_id);

    return PaymentCaptureEntity.findOneBy({ id: payment_id });
  }

}
