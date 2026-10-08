import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../database/database.service';
import { DriversRepository } from './drivers.repository';

describe('DriversRepository', () => {
  let repository: DriversRepository;
  const database = { db: { select: jest.fn(), insert: jest.fn() } };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversRepository,
        { provide: DatabaseService, useValue: database },
      ],
    }).compile();

    repository = module.get<DriversRepository>(DriversRepository);
  });

  it('finds a driver by user id and returns null when absent', async () => {
    const driver = { id: 'user-id', cnh: '12345678901' };
    const where = jest.fn().mockResolvedValue([driver]);
    const from = jest.fn().mockReturnValue({ where });
    database.db.select.mockReturnValue({ from });

    await expect(repository.findById(driver.id)).resolves.toEqual(driver);

    where.mockResolvedValue([]);
    await expect(repository.findById('missing-user')).resolves.toBeNull();
  });

  it('finds a driver by CNH and returns null when absent', async () => {
    const driver = { id: 'user-id', cnh: '12345678901' };
    const where = jest.fn().mockResolvedValue([driver]);
    const from = jest.fn().mockReturnValue({ where });
    database.db.select.mockReturnValue({ from });

    await expect(repository.findByCnh(driver.cnh)).resolves.toEqual(driver);

    where.mockResolvedValue([]);
    await expect(repository.findByCnh('missing-cnh')).resolves.toBeNull();
  });

  it('inserts a driver with the default pending status', async () => {
    const driver = {
      id: 'driver-id',
      userId: 'user-id',
      cnh: '12345678901',
      status: 'PENDING_APPROVAL' as const,
    };
    const returning = jest.fn().mockResolvedValue([driver]);
    const values = jest.fn().mockReturnValue({ returning });
    database.db.insert.mockReturnValue({ values });

    await expect(
      repository.createDriver({ ...driver, status: undefined }),
    ).resolves.toEqual(driver);
    expect(values).toHaveBeenCalledWith(driver);
    expect(returning).toHaveBeenCalledTimes(1);
  });
});
