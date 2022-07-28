import {
  forwardRef, Module
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormResponseController } from './form-response.controller';
import { FormResponseEntity } from './form-response.entity';
import { FormResponseService } from './form-response.service';
import { FormResponseJob } from './form-response.job';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([FormResponseEntity]),
  ],
  controllers: [FormResponseController],
  providers: [
    FormResponseJob,
    FormResponseService,
  ],
  exports: [FormResponseService],
})
export class FormResponseModule { }
