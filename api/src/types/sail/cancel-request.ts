import { ApiProperty } from '@nestjs/swagger';

export class CancelRequest {
  @ApiProperty()
  cancel_reason: string;
  @ApiProperty()
  cancelled_by_id: string;
}
