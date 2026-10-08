import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({
    description: 'UUID do usuário já cadastrado na tabela users.',
    example: 'ba3f5079-0b4b-40aa-a0d2-c3ef555ec67b',
  })
  @IsUUID('4', { message: 'O userId deve ser um UUID v4 válido.' })
  @IsNotEmpty({ message: 'O userId é obrigatório.' })
  userId: string;

  @ApiProperty({
    description: 'Número da Carteira Nacional de Habilitação (CNH).',
    example: '12345678901',
  })
  @IsString({ message: 'A CNH deve ser uma string.' })
  @IsNotEmpty({ message: 'A CNH é obrigatória.' })
  cnh: string;
}