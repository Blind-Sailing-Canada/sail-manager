import {
  Controller, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { MediaService } from './media.service';

@Controller('media')
@ApiTags('media')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class MediaController {
  constructor(public service: MediaService) { }
}
