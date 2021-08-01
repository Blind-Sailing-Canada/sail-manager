import {
  Body,
  Controller,  Delete,  Get,  Param,  Post, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { SailCategoryEntity } from './sail-category.entity';
import { SailCategory } from '../types/sail/sail-category';
import { UserRoles } from '../guards/user-roles.decorator';
import { ProfileRole } from '../types/profile/profile-role';
import { RolesGuard } from '../guards/roles.guard';

@Controller('sail/category')
@ApiTags('sail/category')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailCategoryController {

  @Get('/')
  getAll() {
    return SailCategoryEntity.find();
  }

  @Post('/')
  @UserRoles(ProfileRole.Admin)
  @UseGuards(RolesGuard)
  create(@Body() sailTypeInfo: SailCategory) {
    const newSailType = SailCategoryEntity.create(sailTypeInfo);

    return newSailType.save();
  }

  @Delete('/:id')
  @UserRoles(ProfileRole.Admin)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id) {
    const deleted = await SailCategoryEntity.delete(id);

    if (deleted.affected !== 1) {
      throw new Error(`Failed to delete SailCategory(${id})`);
    }
  }

}
