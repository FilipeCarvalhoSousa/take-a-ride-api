import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AcceptRideDto } from '../dto/accept-ride.dto';
import { CreateRideDto } from '../dto/create-ride.dto';
import { RidesService } from '../service/rides.service';

@ApiTags('Rides')
@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post()
  @ApiOperation({ summary: 'Solicita uma nova corrida' })
  @ApiCreatedResponse({ description: 'Corrida solicitada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos.' })
  @ApiNotFoundResponse({ description: 'Corrida não encontrada.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @ApiServiceUnavailableResponse({
    description: 'Serviço temporariamente indisponível.',
  })
  createRide(@Body() dto: CreateRideDto) {
    return this.ridesService.createRide(dto);
  }

  @Get('find-by-id/:id')
  @ApiOperation({ summary: 'Busca os detalhes de uma corrida por ID' })
  @ApiOkResponse({ description: 'Dados da corrida retornados com sucesso.' })
  @ApiNotFoundResponse({ description: 'Corrida não encontrada.' })
  getRideById(@Param('id') id: string) {
    return this.ridesService.getRideById(id);
  }

  @Get('passenger/:passengerId')
  @ApiOperation({ summary: 'Histórico de corridas de um passageiro' })
  @ApiOkResponse({ description: 'Lista de corridas do passageiro.' })
  getPassengerHistory(@Param('passengerId') passengerId: string) {
    return this.ridesService.getPassengerHistory(passengerId);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Motorista aceita uma corrida' })
  @ApiOkResponse({ description: 'Corrida aceita com sucesso.' })
  @ApiBadRequestResponse({ description: 'Corrida indisponível para aceite.' })
  @ApiNotFoundResponse({ description: 'Corrida não encontrada.' })
  acceptRide(@Param('id') id: string, @Body() dto: AcceptRideDto) {
    return this.ridesService.acceptRide(id, dto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Finaliza uma corrida' })
  @ApiOkResponse({ description: 'Corrida finalizada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Corrida não encontrada.' })
  completeRide(@Param('id') id: string) {
    return this.ridesService.completeRide(id);
  }
}
