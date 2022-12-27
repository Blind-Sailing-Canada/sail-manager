import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProductPurchaseEntity } from './product-purchase.entity';

@Injectable()
export class ProductPurchaseService extends TypeOrmCrudService<ProductPurchaseEntity> {
  constructor(@InjectRepository(ProductPurchaseEntity) repo: Repository<ProductPurchaseEntity>) {
    super(repo);
  }
}
