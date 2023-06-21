import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtObject } from '../types/token/jwt-object';
import { PaymentCaptureEntity } from './payment-capture.entity';

@Injectable()
export class PaymentCaptureEditGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user || !user.profile_id) {
      return false;
    }

    const captureId = request.params.id;

    if (!captureId) {
      return false;
    }

    const capture = await PaymentCaptureEntity.findOne({ where: { id: captureId, } });

    if (!capture) {
      return false;
    }

    if (capture.payment_processor !== 'manual') {
      return false;
    }

    return true;
  }
}

