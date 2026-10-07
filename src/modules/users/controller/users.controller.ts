import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
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
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../service/users.service';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get(':id')
  @ApiBadRequestResponse({
    description: 'O identificador informado não é um UUID válido.'
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.'
  })
  @ApiOkResponse({ description: 'Usuário encontrado.' })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.'
  })
  @ApiOperation({ summary: 'Busca usuário pelo identificador' })
  findById(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.usersService.findById(id);
  }

  @Get('/find-by-email/:email')
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.'
  })
  @ApiOkResponse({ description: 'Usuário encontrado.' })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.'
  })
  @ApiOperation({ summary: 'Busca usuário pelo e-mail' })
  findByEmail(
    @Param('email')
    email: string,
  ) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso.',

  })
  @ApiConflictResponse({
    description: 'Já existe um usuário com esse e-mail.'
  })
  @ApiBadRequestResponse({
    description: 'Dados do usuário inválidos.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.'
  })
  createNewUser(
    @Body() user: CreateUserDto,
  ) {
    return this.usersService.createNewUser(user);
  }
}
