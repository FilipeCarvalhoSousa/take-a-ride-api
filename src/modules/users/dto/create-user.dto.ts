import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário.',
    example: 'João da Silva',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail do usuário.',
    example: 'joao.silva@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Telefone do usuário com código do país.',
    example: '+5511999999999',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: 'Senha@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}