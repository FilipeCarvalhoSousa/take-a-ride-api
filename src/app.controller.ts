import { Controller, Get, Redirect } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Aplicação')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/api/docs', 302)
  @ApiOperation({ summary: 'Redireciona para a documentação da API' })
  @ApiResponse({ status: 302, description: 'Redireciona para o Swagger UI.' })
  redirectToDocs(): void {}

  @Get('health')
  @ApiOperation({ summary: 'Verifica a saúde da aplicação' })
  @ApiOkResponse({
    description: 'A aplicação está em execução.',
    schema: { example: { status: 'ok' } },
  })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }

  @Get('version')
  @ApiOperation({ summary: 'Retorna a versão da aplicação' })
  @ApiOkResponse({
    description: 'Versão atual da aplicação.',
    schema: { example: { version: '0.0.1' } },
  })
  getVersion(): { version: string } {
    return this.appService.getVersion();
  }
}
