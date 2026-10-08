import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../repository/users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const repository = {
    createUser: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a public user without the password hash when finding by id', async () => {
    const user = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'João da Silva',
      email: 'joao.silva@example.com',
      phone: '+5511999999999',
      role: 'PASSENGER' as const,
      passwordHash: 'hashed-password',
      createdAt: new Date('2026-10-07T12:00:00.000Z'),
      updatedAt: new Date('2026-10-07T12:00:00.000Z'),
    };
    repository.findById.mockResolvedValue([user]);

    await expect(service.findById(user.id)).resolves.toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it('returns a public user without the password hash when finding by email', async () => {
    const user = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'João da Silva',
      email: 'joao.silva@example.com',
      phone: '+5511999999999',
      role: 'PASSENGER' as const,
      passwordHash: 'hashed-password',
      createdAt: new Date('2026-10-07T12:00:00.000Z'),
      updatedAt: new Date('2026-10-07T12:00:00.000Z'),
    };
    repository.findByEmail.mockResolvedValue([user]);

    await expect(service.findByEmail(user.email)).resolves.toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it('throws when a user id is not found', async () => {
    repository.findById.mockResolvedValue([]);

    await expect(service.findById('missing-user')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws when an email is not found', async () => {
    repository.findByEmail.mockResolvedValue([]);

    await expect(service.findByEmail('missing@example.com')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('rejects a duplicate email without hashing or creating the user', async () => {
    repository.findByEmail.mockResolvedValue([{ id: 'existing-user' }]);

    await expect(
      service.createNewUser({
        name: 'João da Silva',
        email: 'joao.silva@example.com',
        phone: '+5511999999999',
        password: 'Senha@123',
      }),
    ).rejects.toThrow(ConflictException);

    expect(repository.createUser).not.toHaveBeenCalled();
  });

  it('generates the user id when creating a user', async () => {
    repository.findByEmail.mockResolvedValue([]);
    repository.createUser.mockImplementation(async (user) => ({
      ...user,
      role: 'PASSENGER',
      createdAt: new Date('2026-10-07T12:00:00.000Z'),
      updatedAt: new Date('2026-10-07T12:00:00.000Z'),
    }));

    const user = {
      name: 'João da Silva',
      email: 'joao.silva@example.com',
      phone: '+5511999999999',
      password: 'Senha@123',
    };

    const createdUser = await service.createNewUser(user);

    expect(createdUser.id).toEqual(expect.any(String));
    expect(createdUser).not.toHaveProperty('passwordHash');
    expect(repository.createUser).toHaveBeenCalledWith({
      id: createdUser.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: expect.any(String),
    });
  });
});
