import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../database/database.service';
import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  const database = { db: { select: jest.fn(), insert: jest.fn() } };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: DatabaseService, useValue: database },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('finds a user by email', async () => {
    const user = { id: 'user-id', email: 'user@example.com' };
    const limit = jest.fn().mockResolvedValue([user]);
    const where = jest.fn().mockReturnValue({ limit });
    const from = jest.fn().mockReturnValue({ where });
    database.db.select.mockReturnValue({ from });

    await expect(repository.findByEmail(user.email)).resolves.toEqual([user]);
    expect(database.db.select).toHaveBeenCalledTimes(1);
    expect(where).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledWith(1);
  });

  it('finds a user by id', async () => {
    const user = { id: 'user-id' };
    const limit = jest.fn().mockResolvedValue([user]);
    const where = jest.fn().mockReturnValue({ limit });
    const from = jest.fn().mockReturnValue({ where });
    database.db.select.mockReturnValue({ from });

    await expect(repository.findById(user.id)).resolves.toEqual([user]);
    expect(database.db.select).toHaveBeenCalledTimes(1);
    expect(where).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledWith(1);
  });

  it('inserts a user and returns the inserted record', async () => {
    const user = {
      id: 'user-id',
      name: 'João da Silva',
      email: 'user@example.com',
      phone: '+5511999999999',
      passwordHash: 'hashed-password',
    };
    const returning = jest.fn().mockResolvedValue([user]);
    const values = jest.fn().mockReturnValue({ returning });
    database.db.insert.mockReturnValue({ values });

    await expect(repository.createUser(user)).resolves.toBe(user);
    expect(values).toHaveBeenCalledWith(user);
    expect(returning).toHaveBeenCalledTimes(1);
  });
});
