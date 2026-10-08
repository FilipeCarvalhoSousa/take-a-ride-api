import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AcceptRideDto {
  @ApiProperty({
    description: 'UUID do motorista que aceitou a corrida.',
    example: 'f8c3de12-84b2-4d5e-9012-34567890abcd',
  })
  @IsUUID()
  driverId: string;
}