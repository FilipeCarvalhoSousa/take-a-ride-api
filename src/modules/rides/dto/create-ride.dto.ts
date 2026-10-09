import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateRideDto {
  @ApiProperty({
    description: 'UUID do passageiro solicitante.',
    example: 'ba3f5079-0b4b-40aa-a0d2-c3ef555ec67b',
  })
  @IsUUID()
  passengerId: string;

  @ApiProperty({
    description: 'Endereço de origem.',
    example: 'Av. Paulista, 1000 - São Paulo',
  })
  @IsString()
  originAddress: string;

  @ApiProperty({ description: 'Latitude de origem.', example: -23.5615 })
  @IsNumber()
  originLat: number;

  @ApiProperty({ description: 'Longitude de origem.', example: -46.656 })
  @IsNumber()
  originLng: number;

  @ApiProperty({
    description: 'Endereço de destino.',
    example: 'Praça da Sé - São Paulo',
  })
  @IsString()
  destinationAddress: string;

  @ApiProperty({ description: 'Latitude de destino.', example: -23.5505 })
  @IsNumber()
  destinationLat: number;

  @ApiProperty({ description: 'Longitude de destino.', example: -46.6333 })
  @IsNumber()
  destinationLng: number;

  @ApiProperty({
    description: 'Preço estimado da corrida (R$).',
    example: 24.5,
  })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Distância estimada em km.', example: 5.2 })
  @IsNumber()
  distance: number;

  @ApiProperty({ example: 'Ceilândia', description: 'Cidade/RA de origem' })
  @IsString()
  @IsNotEmpty()
  originCity: string;

  @ApiProperty({ example: 'Taguatinga', description: 'Cidade/RA de destino' })
  @IsString()
  @IsNotEmpty()
  destinationCity: string;

  @ApiProperty({
    example: false,
    description: 'Se a rota envolve cidades do Entorno do DF',
  })
  @IsBoolean()
  isEntorno: boolean;

  @ApiProperty({
    example: 1,
    description: 'Quantidade de assentos solicitados pelo passageiro',
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Max(4)
  seatsRequested: number;
}
