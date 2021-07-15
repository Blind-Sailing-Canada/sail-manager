import { ApiProperty } from '@nestjs/swagger';

export class CancelRequest {
  @ApiProperty()
  cancelReason: string;
  @ApiProperty()
  cancelledById: string;
}
