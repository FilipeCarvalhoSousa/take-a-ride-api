import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Realiza a autenticação de usuário (Passageiro ou Motorista)',
  })
  @ApiOkResponse({
    description: 'Login realizado com sucesso. Retorna o token JWT.',
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  login(@Body() dto: LoginDto) {
    return this.authService.validateUserAndLogin(dto);
  }
}
