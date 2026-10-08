import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../database/database.service';
import { CreateRideDto } from '../dto/create-ride.dto';
import { RidesRepository } from './rides.repository';

describe('RidesRepository', () => {
  let repository: RidesRepository;
  const database = {
    db: { insert: jest.fn(), select: jest.fn(), update: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidesRepository,
        { provide: DatabaseService, useValue: database },
      ],
    }).compile();

    repository = module.get<RidesRepository>(RidesRepository);
  });

  it('creates a requested ride and returns the inserted record', async () => {
    const dto: CreateRideDto & { id: string } = {
      id: 'ride-id',
      passengerId: 'passenger-id',
      originAddress: 'Origin',
      originLat: 0,
      originLng: 0,
      destinationAddress: 'Destination',
      destinationLat: 1,
      destinationLng: 1,
      price: 24.5,
      distance: 5.2,
    };
    const ride = {
      id: dto.id,
      passengerId: dto.passengerId,
      originAddress: dto.originAddress,
      originLat: dto.originLat,
      originLng: dto.originLng,
      destinationAddress: dto.destinationAddress,
      destinationLat: dto.destinationLat,
      destinationLng: dto.destinationLng,
      price: dto.price,
      distance: dto.distance,
      status: 'REQUESTED' as const,
    };
    const returning = jest.fn().mockResolvedValue([ride]);
    const values = jest.fn().mockReturnValue({ returning });
    database.db.insert.mockReturnValue({ values });

    await expect(repository.createRide(dto)).resolves.toEqual(ride);
    expect(values).toHaveBeenCalledWith(ride);
    expect(returning).toHaveBeenCalledTimes(1);
  });

  it('finds a ride by id', async () => {
    const ride = { id: 'ride-id' };
    const limit = jest.fn().mockResolvedValue([ride]);
    const where = jest.fn().mockReturnValue({ limit });
    const from = jest.fn().mockReturnValue({ where });
    database.db.select.mockReturnValue({ from });

    await expect(repository.findById(ride.id)).resolves.toBe(ride);
    expect(limit).toHaveBeenCalledWith(1);
  });

  it('returns passenger rides ordered by newest first', async () => {
    const rides = [{ id: 'ride-id' }];
    const orderBy = jest.fn().mockResolvedValue(rides);
    const where = jest.fn().mockReturnValue({ orderBy });
    const from = jest.fn().mockReturnValue({ where });
    database.db.select.mockReturnValue({ from });

    await expect(repository.findByPassengerId('passenger-id')).resolves.toBe(
      rides,
    );
    expect(where).toHaveBeenCalledTimes(1);
    expect(orderBy).toHaveBeenCalledTimes(1);
  });

  it('updates ride status and returns the updated record', async () => {
    const ride = { id: 'ride-id', status: 'COMPLETED' };
    const returning = jest.fn().mockResolvedValue([ride]);
    const where = jest.fn().mockReturnValue({ returning });
    const set = jest.fn().mockReturnValue({ where });
    database.db.update.mockReturnValue({ set });
    const update = {
      status: 'COMPLETED' as const,
      endedAt: new Date('2026-10-08T00:00:00.000Z'),
    };

    await expect(
      repository.updateRideStatus('ride-id', update),
    ).resolves.toBe(ride);
    expect(set).toHaveBeenCalledWith(update);
    expect(returning).toHaveBeenCalledTimes(1);
  });
});
