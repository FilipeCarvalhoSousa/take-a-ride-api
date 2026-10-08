import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../users/repository/users.repository';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { DriversRepository } from '../repository/drivers.repository';
import { DriversService } from './drivers.service';

describe('DriversService', () => {
  let service: DriversService;
  const repository = {
    createDriver: jest.fn(),
    findByCnh: jest.fn(),
    findById: jest.fn(),
  };
  const usersRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversService,
        { provide: DriversRepository, useValue: repository },
        { provide: UsersRepository, useValue: usersRepository },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  it('returns a driver when searching by id', async () => {
    const driver = { id: 'driver-id', userId: 'user-id' };
    repository.findById.mockResolvedValue(driver);

    await expect(service.findById(driver.id)).resolves.toBe(driver);
    expect(repository.findById).toHaveBeenCalledWith(driver.id);
  });

  it('throws when a driver id is not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns the user associated with an email', async () => {
    const user = { id: 'user-id', email: 'driver@example.com' };
    usersRepository.findByEmail.mockResolvedValue([user]);

    await expect(service.findByEmail(user.email)).resolves.toBe(user);
  });

  it('throws when no user exists for an email', async () => {
    usersRepository.findByEmail.mockResolvedValue([]);

    await expect(service.findByEmail('missing@example.com')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws when creating a driver for a missing user', async () => {
    usersRepository.findById.mockResolvedValue([]);

    await expect(
      service.createNewDriver({
        userId: 'missing-user',
        cnh: '12345678901',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('rejects a user who already has a driver profile', async () => {
    usersRepository.findById.mockResolvedValue([{ id: 'user-id' }]);
    repository.findById.mockResolvedValue({ id: 'existing-driver' });

    await expect(
      service.createNewDriver({
        userId: 'user-id',
        cnh: '12345678901',
      }),
    ).rejects.toThrow(ConflictException);
    expect(repository.findByCnh).not.toHaveBeenCalled();
  });

  it('rejects a CNH that is already registered', async () => {
    usersRepository.findById.mockResolvedValue([{ id: 'user-id' }]);
    repository.findById.mockResolvedValue(null);
    repository.findByCnh.mockResolvedValue({ id: 'existing-driver' });

    await expect(
      service.createNewDriver({
        userId: 'user-id',
        cnh: '12345678901',
      }),
    ).rejects.toThrow(ConflictException);
    expect(repository.createDriver).not.toHaveBeenCalled();
  });

  it('creates a driver with a generated id and pending approval status', async () => {
    usersRepository.findById.mockResolvedValue([{ id: 'user-id' }]);
    repository.findById.mockResolvedValue(null);
    repository.findByCnh.mockResolvedValue(null);
    repository.createDriver.mockImplementation(async (driver) => driver);
    const dto: CreateDriverDto = {
      userId: 'user-id',
      cnh: '12345678901',
    };

    const createdDriver = await service.createNewDriver(dto);

    expect(createdDriver).toMatchObject({
      id: expect.any(String),
      userId: dto.userId,
      cnh: dto.cnh,
      status: 'PENDING_APPROVAL',
    });
    expect(repository.createDriver).toHaveBeenCalledWith(createdDriver);
  });
});
