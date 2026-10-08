import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    createNewUser: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates user lookup by id', async () => {
    usersService.findById.mockResolvedValue({ id: 'user-id' });

    await expect(controller.findById('user-id')).resolves.toEqual({
      id: 'user-id',
    });
    expect(usersService.findById).toHaveBeenCalledWith('user-id');
  });

  it('delegates user lookup by email', async () => {
    usersService.findByEmail.mockResolvedValue({ email: 'user@example.com' });

    await expect(
      controller.findByEmail('user@example.com'),
    ).resolves.toEqual({ email: 'user@example.com' });
    expect(usersService.findByEmail).toHaveBeenCalledWith('user@example.com');
  });

  it('delegates user creation', async () => {
    const dto: CreateUserDto = {
      name: 'João da Silva',
      email: 'joao.silva@example.com',
      phone: '+5511999999999',
      password: 'Senha@123',
    };
    usersService.createNewUser.mockResolvedValue({ id: 'user-id' });

    await expect(controller.createNewUser(dto)).resolves.toEqual({
      id: 'user-id',
    });
    expect(usersService.createNewUser).toHaveBeenCalledWith(dto);
  });
});
