import {
  Controller, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { AchievementService } from './achievement.service';

@Controller('achievement')
@ApiTags('achievement')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class AchievementController {
  constructor(public service: AchievementService) { }
}
