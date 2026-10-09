import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AcceptRideDto } from '../dto/accept-ride.dto';
import { CreateRideDto } from '../dto/create-ride.dto';
import { RidesRepository } from '../repository/rides.repository';

import { UsersService } from '../../users/service/users.service';
import { RidesGateway } from '../gateway/rides.gateway';
import { calculateFixedFare } from '../../../common/utils/fare-calculator.util';

@Injectable()
export class RidesService {
  constructor(
    private readonly repository: RidesRepository,
    private readonly userService: UsersService,
    private readonly gateway: RidesGateway,
  ) {}

  async createRide(dto: CreateRideDto) {
    await this.userService.findById(dto.passengerId);

    const rideWithId = {
      ...dto,
      id: crypto.randomUUID(),
    };
    const unitPrice = calculateFixedFare({
      originCity: dto.originCity,
      destinationCity: dto.destinationCity,
      isEntorno: dto.isEntorno,
    });

    const totalPrice = unitPrice * dto.seatsRequested;
    const newRide = await this.repository.createRide({
      ...rideWithId,
      price: totalPrice,
      seatsRequested: dto.seatsRequested,
    });

    this.gateway.notifyNewRide(newRide);
    return newRide;
  }

  async getRideById(id: string) {
    const ride = await this.repository.findById(id);
    if (!ride) throw new NotFoundException('Corrida não encontrada.');
    return ride;
  }

  async getPassengerHistory(passengerId: string) {
    return this.repository.findByPassengerId(passengerId);
  }

  async acceptRide(rideId: string, dto: AcceptRideDto) {
    const ride = await this.getRideById(rideId);

    if (ride.status !== 'REQUESTED') {
      throw new BadRequestException(
        'Esta corrida não está mais disponível para aceite.',
      );
    }

    const updatedRide = await this.repository.updateRideStatus(rideId, {
      status: 'ACCEPTED',
      driverId: dto.driverId,
      startedAt: new Date(),
    });

    this.gateway.notifyRideStatusUpdate(rideId, updatedRide);
    return updatedRide;
  }

  async completeRide(rideId: string) {
    await this.getRideById(rideId);
    const completedRide = await this.repository.updateRideStatus(rideId, {
      status: 'COMPLETED',
      endedAt: new Date(),
    });

    this.gateway.notifyRideStatusUpdate(rideId, completedRide);

    return completedRide;
  }
}
