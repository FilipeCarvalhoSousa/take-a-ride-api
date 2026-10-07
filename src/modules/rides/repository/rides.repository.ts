import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from "drizzle-orm";
import { DatabaseService } from "../../../database/database.service";

import { rides } from "../../../database/schema/rides.schema";
import { CreateRideDto } from '../dto/create-ride.dto';


@Injectable()
export class RidesRepository {
  constructor(
    private readonly database: DatabaseService,
  ) { }

  async createRide(dto: CreateRideDto) {
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
        price: dto.price,
        distance: dto.distance,
        status: 'REQUESTED',
      })
      .returning();

    return newRide;
  }

  // 2. Aceitar a corrida
  async acceptRide(rideId: string, driverId: string) {
    const [updatedRide] = await this.database.db
      .update(rides)
      .set({
        driverId,
        status: 'ACCEPTED',
        startedAt: new Date(),
      })
      .where(eq(rides.id, rideId))
      .returning();

    if (!updatedRide) throw new NotFoundException('Corrida não encontrada');
    return updatedRide;
  }

  // 3. Buscar histórico do passageiro
  async getPassengerHistory(passengerId: string) {
    const db = this.database.db as any;

    return db.query.rides.findMany({
      where: eq(rides.passengerId, passengerId),
      with: {
        driver: {
          columns: { id: true, name: true, phone: true },
        },
      },
      orderBy: (
        rideTable: typeof rides,
        { desc }: { desc: (column: typeof rides.createdAt) => any },
      ) => [desc(rideTable.createdAt)],
    });
  }

  // 4. Buscar detalhes de uma corrida
  async getRideById(id: string) {
    const db = this.database.db as any;
    const ride = await db.query.rides.findFirst({
      where: eq(rides.id, id),
      with: {
        passenger: { columns: { id: true, name: true, phone: true } },
        driver: { columns: { id: true, name: true, phone: true } },
      },
    });

    if (!ride) throw new NotFoundException('Corrida não encontrada');
    return ride;
  }
}