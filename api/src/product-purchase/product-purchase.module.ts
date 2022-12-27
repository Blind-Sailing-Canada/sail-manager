import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProductPurchaseController } from './product-purchase.controller';
import { ProductPurchaseEntity } from './product-purchase.entity';
import { ProductPurchaseService } from './product-purchase.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProductPurchaseEntity]),
  ],
  controllers: [ProductPurchaseController,],
  providers: [ProductPurchaseService],
})
export class ProductPurchaseModule { }
