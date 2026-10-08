import { REDIRECT_METADATA } from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  const appService = { getVersion: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('redirects the root route to the Swagger UI', () => {
    const redirectHandler = Object.getOwnPropertyDescriptor(
      AppController.prototype,
      'redirectToDocs',
    )?.value;

    expect(
      Reflect.getMetadata(REDIRECT_METADATA, redirectHandler),
    ).toEqual({ url: '/api/docs', statusCode: 302 });
  });

  it('returns the health status', () => {
    expect(controller.getHealth()).toEqual({ status: 'ok' });
  });

  it('returns the application version', () => {
    appService.getVersion.mockReturnValue({ version: '1.2.3' });

    expect(controller.getVersion()).toEqual({ version: '1.2.3' });
    expect(appService.getVersion).toHaveBeenCalledTimes(1);
  });
});
