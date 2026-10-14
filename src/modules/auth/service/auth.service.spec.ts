import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/repository/users.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersRepository = { findByEmail: jest.fn() };
  const jwtService = { sign: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: usersRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects an unknown email', async () => {
    usersRepository.findByEmail.mockResolvedValue([]);

    await expect(
      service.validateUserAndLogin({
        email: 'missing@example.com',
        password: 'password',
      }),
    ).rejects.toThrow('E-mail ou senha incorretos.');
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
