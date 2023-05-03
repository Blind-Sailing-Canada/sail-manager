import {
  BadRequestException, Body, Controller, Get, Headers, Param, Post, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { FormResponseService } from './form-response.service';
import { FormResponseEntity } from './form-response.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { FormResponse } from '../types/form-response/form-response';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { IsNull } from 'typeorm';

@Crud({
  model: { type: FormResponseEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: { alwaysPaginate: true },
  routes: { only: [] },
})
@Controller('form-response')
@ApiTags('form-response')
export class FormResponseController {
  constructor(public service: FormResponseService) { }

  @Post()
  async createFormResponse(@Body() body: FormResponse, @Headers('Authorization') authorization: string) {
    if (authorization !== process.env.GOOGLE_FORMS_RESPONSE_AUTH_TOKEN) {
      throw new UnauthorizedException();
    }

    if (!body.email) {
      throw new BadRequestException('Email is a required field');
    }

    const profile = await ProfileEntity.findOne({ where: { email: body.email } });

    const formResponse = FormResponseEntity.create({
      ...body,
      profile_id: profile?.id || null
    });

    await formResponse.save();
  }

  @UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
  @Get('/profile/:profile_id')
  async getFormResponsesForProfile(@Param('profile_id') profile_id) {
    if (!profile_id) {
      throw new BadRequestException('profile_id is required');
    }

    const profile = await ProfileEntity.findOneOrFail({ where: { id: profile_id } });

    return FormResponseEntity.find({
      where: [
        { profile_id },
        {
          profile_id: IsNull(),
          email: profile.email,
        }
      ],
      order: { created_at: 'DESC' }
    });
  }
}
