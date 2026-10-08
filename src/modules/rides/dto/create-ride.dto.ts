import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRideDto {
  @ApiProperty({
    description: 'UUID do passageiro solicitante.',
    example: 'ba3f5079-0b4b-40aa-a0d2-c3ef555ec67b',
  })
  @IsUUID()
  passengerId: string;

  @ApiProperty({ description: 'Endereço de origem.', example: 'Av. Paulista, 1000 - São Paulo' })
  @IsString()
  originAddress: string;

  @ApiProperty({ description: 'Latitude de origem.', example: -23.5615 })
  @IsNumber()
  originLat: number;

  @ApiProperty({ description: 'Longitude de origem.', example: -46.6560 })
  @IsNumber()
  originLng: number;

  @ApiProperty({ description: 'Endereço de destino.', example: 'Praça da Sé - São Paulo' })
  @IsString()
  destinationAddress: string;

  @ApiProperty({ description: 'Latitude de destino.', example: -23.5505 })
  @IsNumber()
  destinationLat: number;

  @ApiProperty({ description: 'Longitude de destino.', example: -46.6333 })
  @IsNumber()
  destinationLng: number;

  @ApiProperty({ description: 'Preço estimado da corrida (R$).', example: 24.50 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Distância estimada em km.', example: 5.2 })
  @IsNumber()
  distance: number;
}