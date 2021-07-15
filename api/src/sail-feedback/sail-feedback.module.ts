import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SailFeedbackController } from './sail-feedback.controller';
import { SailFeedbackEntity } from './sail-feedback.entity';
import { SailFeedbackService } from './sail-feedback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SailFeedbackEntity]),
    AuthModule,
  ],
  controllers: [SailFeedbackController],
  providers: [SailFeedbackService],
})
export class SailFeedbackModule { }
