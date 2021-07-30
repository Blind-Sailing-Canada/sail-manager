import {
  Body,
  Controller, Param, Patch, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { getManager } from 'typeorm';
import { BoatEntity } from '../boat/boat.entity';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SomeUserAccessGuard } from '../guards/some-user-access.guard';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { UserAccess } from '../user-access/user-access.decorator';
import { BoatInstructionsEntity } from './boat-instructions.entity';
import { BoatInstructionsService } from './boat-instructions.service';

@Crud({
  model: { type: BoatInstructionsEntity },
  routes: { only: ['updateOneBase'] },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: { alwaysPaginate: false },
})
@Controller('boat-instructions')
@ApiTags('boat-instructions')
@UserAccess(UserAccessFields.CreateBoat, UserAccessFields.EditBoat)
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, SomeUserAccessGuard)
export class BoatInstructionsController {
  constructor(public service: BoatInstructionsService) { }

  @Patch('/update-boat-instructions/:boat_id')
  async updateBoatInstructions(@Param('boat_id') boat_id: string, @Body() instructions) {
    const boat = await BoatEntity.findOne(boat_id);

    await getManager().transaction(async transactionalEntityManager => {
      await Promise.all(boat.instructions
        .filter((instruction) => instructions[instruction.id])
        .map((instruction) => transactionalEntityManager.update(BoatInstructionsEntity, { id: instruction.id }, instructions[instruction.id])));
    });

    return BoatEntity.findOne(boat_id);
  }
}
