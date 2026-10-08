import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/service/users.service';
import { AcceptRideDto } from '../dto/accept-ride.dto';
import { CreateRideDto } from '../dto/create-ride.dto';
import { RidesService } from '../service/rides.service';
import { RidesController } from './rides.controller';

describe('RidesController', () => {
  let controller: RidesController;
  const service = {
    acceptRide: jest.fn(),
    completeRide: jest.fn(),
    createRide: jest.fn(),
    getPassengerHistory: jest.fn(),
    getRideById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RidesController],
      providers: [
        { provide: RidesService, useValue: service },
        { provide: UsersService, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    controller = module.get<RidesController>(RidesController);
  });

  it('delegates ride creation', async () => {
    const dto: CreateRideDto = {
      passengerId: 'passenger-id',
      originAddress: 'Origin',
      originLat: 0,
      originLng: 0,
      destinationAddress: 'Destination',
      destinationLat: 1,
      destinationLng: 1,
      price: 1,
      distance: 1,
    };
    service.createRide.mockResolvedValue({ id: 'ride-id' });

    await expect(controller.createRide(dto)).resolves.toEqual({
      id: 'ride-id',
    });
    expect(service.createRide).toHaveBeenCalledWith(dto);
  });

  it('delegates ride lookup by id', async () => {
    service.getRideById.mockResolvedValue({ id: 'ride-id' });

    await expect(controller.getRideById('ride-id')).resolves.toEqual({
      id: 'ride-id',
    });
    expect(service.getRideById).toHaveBeenCalledWith('ride-id');
  });

  it('delegates passenger history lookup', async () => {
    service.getPassengerHistory.mockResolvedValue([]);

    await expect(controller.getPassengerHistory('passenger-id')).resolves.toEqual(
      [],
    );
    expect(service.getPassengerHistory).toHaveBeenCalledWith('passenger-id');
  });

  it('delegates ride acceptance', async () => {
    const dto: AcceptRideDto = { driverId: 'driver-id' };
    service.acceptRide.mockResolvedValue({ id: 'ride-id' });

    await expect(controller.acceptRide('ride-id', dto)).resolves.toEqual({
      id: 'ride-id',
    });
    expect(service.acceptRide).toHaveBeenCalledWith('ride-id', dto);
  });

  it('delegates ride completion', async () => {
    service.completeRide.mockResolvedValue({ id: 'ride-id' });

    await expect(controller.completeRide('ride-id')).resolves.toEqual({
      id: 'ride-id',
    });
    expect(service.completeRide).toHaveBeenCalledWith('ride-id');
  });
});
