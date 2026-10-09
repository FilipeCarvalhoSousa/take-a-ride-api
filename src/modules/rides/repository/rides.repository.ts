import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';


import { DatabaseService } from '../../../database/database.service';
import { rides } from '../../../database/schema/rides.schema';
import { CreateRideDto } from '../dto/create-ride.dto';

@Injectable()
export class RidesRepository {
  constructor(
    private readonly database: DatabaseService,
  ) { }



  async createRide(dto: CreateRideDto & { id: string }) {
    const [newRide] = await this.database.db
      .insert(rides)
      .values({
        passengerId: dto.passengerId,
        originAddress: dto.originAddress,
        originLat: dto.originLat,
        originLng: dto.originLng,
        destinationAddress: dto.destinationAddress,
        destinationLat: dto.destinationLat,
        destinationLng: dto.destinationLng,
        price: dto.price.toString(),
        distance: dto.distance,
        status: 'REQUESTED',
      })
      .returning();

    return newRide;
  }

  async findById(id: string) {
    const [ride] = await this.database.db
      .select()
      .from(rides)
      .where(eq(rides.id, id))
      .limit(1);
    return ride;
  }

  async findByPassengerId(passengerId: string) {
    return this.database.db
      .select()
      .from(rides)
      .where(eq(rides.passengerId, passengerId))
      .orderBy(desc(rides.createdAt));
  }

  async updateRideStatus(
    rideId: string,
    data: { status: 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'; driverId?: string; startedAt?: Date; endedAt?: Date },
  ) {
    const [updatedRide] = await this.database.db
      .update(rides)
      .set(data)
      .where(eq(rides.id, rideId))
      .returning();

    return updatedRide;
  }
}