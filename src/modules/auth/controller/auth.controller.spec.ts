import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = { validateUserAndLogin: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates login to the authentication service', async () => {
    const dto = { email: 'user@example.com', password: 'password' };
    const result = { accessToken: 'token' };
    authService.validateUserAndLogin.mockResolvedValue(result);

    await expect(controller.login(dto)).resolves.toBe(result);
    expect(authService.validateUserAndLogin).toHaveBeenCalledWith(dto);
  });
});
