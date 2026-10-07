// src/modules/rides/dto/create-ride.dto.ts
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRideDto {
  @IsUUID()
  passengerId: string;

  @IsString()
  originAddress: string;

  @IsNumber()
  originLat: number;

  @IsNumber()
  originLng: number;

  @IsString()
  destinationAddress: string;

  @IsNumber()
  destinationLat: number;

  @IsNumber()
  destinationLng: number;

  @IsNumber()
  price: number;

  @IsNumber()
  distance: number;
}