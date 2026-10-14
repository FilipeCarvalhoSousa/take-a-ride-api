import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/service/users.service';
import { AcceptRideDto } from '../dto/accept-ride.dto';
import { CreateRideDto } from '../dto/create-ride.dto';
import { RidesGateway } from '../gateway/rides.gateway';
import { RidesRepository } from '../repository/rides.repository';
import { RidesService } from './rides.service';

describe('RidesService', () => {
  let service: RidesService;
  const repository = {
    createRide: jest.fn(),
    findById: jest.fn(),
    findByPassengerId: jest.fn(),
    updateRideStatus: jest.fn(),
  };
  const usersService = { findById: jest.fn() };
  const gateway = {
    notifyNewRide: jest.fn(),
    notifyDriversNewRide: jest.fn(),
    notifyRideStatusUpdate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidesService,
        { provide: RidesRepository, useValue: repository },
        { provide: UsersService, useValue: usersService },
        { provide: RidesGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get<RidesService>(RidesService);
  });

  it('validates the passenger, creates a ride, and notifies listeners', async () => {
    const dto: CreateRideDto = {
      passengerId: 'passenger-id',
      originAddress: 'Origin',
      originLat: -23.56,
      originLng: -46.65,
      destinationAddress: 'Destination',
      destinationLat: -23.55,
      destinationLng: -46.63,
      price: 24.5,
      distance: 5.2,
      originCity: 'Ceilândia',
      destinationCity: 'Taguatinga',
      isEntorno: false,
      seatsRequested: 2,
    };
    usersService.findById.mockResolvedValue({
      id: dto.passengerId,
      name: 'Passenger Name',
    });
    const ride = {
      id: 'ride-id',
      passengerId: dto.passengerId,
      passengerName: 'Passenger Name',
      originAddress: dto.originAddress,
      originLat: dto.originLat,
      originLng: dto.originLng,
      destinationAddress: dto.destinationAddress,
      destinationLat: dto.destinationLat,
      destinationLng: dto.destinationLng,
      price: 7.6,
      distance: dto.distance,
      originCity: dto.originCity,
      destinationCity: dto.destinationCity,
      isEntorno: dto.isEntorno,
      seatsRequested: dto.seatsRequested,
    };
    repository.createRide.mockResolvedValue(ride);

    await expect(service.createRide(dto)).resolves.toBe(ride);

    expect(usersService.findById).toHaveBeenCalledWith(dto.passengerId);
    expect(repository.createRide).toHaveBeenCalledWith({
      id: expect.any(String),
      passengerId: dto.passengerId,
      passengerName: 'Passenger Name',
      originAddress: dto.originAddress,
      originLat: dto.originLat,
      originLng: dto.originLng,
      destinationAddress: dto.destinationAddress,
      destinationLat: dto.destinationLat,
      destinationLng: dto.destinationLng,
      price: 7.6,
      distance: dto.distance,
      originCity: dto.originCity,
      destinationCity: dto.destinationCity,
      isEntorno: dto.isEntorno,
      seatsRequested: dto.seatsRequested,
    });
    expect(gateway.notifyDriversNewRide).toHaveBeenCalledWith(ride);
  });

  it('does not create a ride when its passenger does not exist', async () => {
    usersService.findById.mockRejectedValue(new NotFoundException());

    await expect(
      service.createRide({
        passengerId: 'missing',
        originAddress: 'Origin',
        originLat: 0,
        originLng: 0,
        destinationAddress: 'Destination',
        destinationLat: 1,
        destinationLng: 1,
        price: 1,
        distance: 1,
        originCity: 'Ceilândia',
        destinationCity: 'Taguatinga',
        isEntorno: false,
        seatsRequested: 1,
      }),
    ).rejects.toThrow(NotFoundException);
    expect(repository.createRide).not.toHaveBeenCalled();
    expect(gateway.notifyDriversNewRide).not.toHaveBeenCalled();
  });

  it('returns a ride by id', async () => {
    const ride = { id: 'ride-id' };
    repository.findById.mockResolvedValue(ride);

    await expect(service.getRideById(ride.id)).resolves.toBe(ride);
  });

  it('throws when a ride id is not found', async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(service.getRideById('missing')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns passenger history from the repository', async () => {
    const rides = [{ id: 'ride-id' }];
    repository.findByPassengerId.mockResolvedValue(rides);

    await expect(service.getPassengerHistory('passenger-id')).resolves.toBe(
      rides,
    );
    expect(repository.findByPassengerId).toHaveBeenCalledWith('passenger-id');
  });

  it('accepts a requested ride and emits the status update', async () => {
    const ride = { id: 'ride-id', status: 'REQUESTED' };
    const acceptedRide = { ...ride, status: 'ACCEPTED' };
    repository.findById.mockResolvedValue(ride);
    repository.updateRideStatus.mockResolvedValue(acceptedRide);
    const dto: AcceptRideDto = { driverId: 'driver-id' };

    await expect(service.acceptRide(ride.id, dto)).resolves.toBe(acceptedRide);

    expect(repository.updateRideStatus).toHaveBeenCalledWith(
      ride.id,
      expect.objectContaining({
        status: 'ACCEPTED',
        driverId: dto.driverId,
        startedAt: expect.any(Date),
      }),
    );
    expect(gateway.notifyRideStatusUpdate).toHaveBeenCalledWith(
      ride.id,
      acceptedRide,
    );
  });

  it('rejects accepting a ride that is no longer requested', async () => {
    repository.findById.mockResolvedValue({
      id: 'ride-id',
      status: 'ACCEPTED',
    });

    await expect(
      service.acceptRide('ride-id', { driverId: 'driver-id' }),
    ).rejects.toThrow(BadRequestException);
    expect(repository.updateRideStatus).not.toHaveBeenCalled();
    expect(gateway.notifyRideStatusUpdate).not.toHaveBeenCalled();
  });

  it('completes a ride and emits the status update', async () => {
    const ride = { id: 'ride-id', status: 'ACCEPTED' };
    const completedRide = { ...ride, status: 'COMPLETED' };
    repository.findById.mockResolvedValue(ride);
    repository.updateRideStatus.mockResolvedValue(completedRide);

    await expect(service.completeRide(ride.id)).resolves.toBe(completedRide);

    expect(repository.updateRideStatus).toHaveBeenCalledWith(
      ride.id,
      expect.objectContaining({
        status: 'COMPLETED',
        endedAt: expect.any(Date),
      }),
    );
    expect(gateway.notifyRideStatusUpdate).toHaveBeenCalledWith(
      ride.id,
      completedRide,
    );
  });
});
