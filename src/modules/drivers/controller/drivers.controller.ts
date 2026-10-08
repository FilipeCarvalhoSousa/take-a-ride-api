import { Body, Post, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DriversService } from '../services/drivers.service';
import { CreateDriverDto } from '../dto/create-driver.dto';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly service: DriversService) { }

  @ApiBadRequestResponse({
    description: 'O identificador informado não é um UUID válido.'
  })
  @ApiNotFoundResponse({
    description: 'Motorista não encontrado.'
  })
  @ApiOkResponse({ description: 'Motorista encontrado.' })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.'
  })
  @ApiOperation({ summary: 'Busca motorista pelo identificador' })
  @Get('find-by-id/:id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @ApiNotFoundResponse({
    description: 'Motorista não encontrado.'
  })
  @ApiOkResponse({ description: 'Motorista encontrado.' })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.'
  })
  @ApiOperation({ summary: 'Busca motorista pelo e-mail' })
  @Get('find-by-email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.service.findByEmail(email);
  }

  @Post() @ApiOperation({ summary: 'Cadastra um perfil de motorista para um usuário existente' }) @ApiCreatedResponse({ description: 'Perfil de motorista criado com sucesso.' }) @ApiBadRequestResponse({ description: 'Dados de entrada inválidos.' }) @ApiNotFoundResponse({ description: 'Usuário informado não foi encontrado.' }) @ApiConflictResponse({ description: 'Este usuário já possui perfil de motorista ou a CNH já está cadastrada.' }) createNewDriver(@Body() dto: CreateDriverDto) { return this.service.createNewDriver(dto); }
}
