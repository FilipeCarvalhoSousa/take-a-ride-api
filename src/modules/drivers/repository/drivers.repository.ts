import { drivers } from './../../../database/schema/drivers.schema';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { DriverInterface } from '../interface/drivers.interface';

@Injectable()
export class DriversRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(userId: string) {
    const [driver] = await this.database.db
      .select()
      .from(drivers)
      .where(eq(drivers.id, userId));
    return driver || null;
  }

  async findByCnh(cnh: string) {
    const [driver] = await this.database.db
      .select()
      .from(drivers)
      .where(eq(drivers.cnh, cnh));
    return driver || null;
  }

  async createDriver(driver: DriverInterface) {
    const [newDriver] = await this.database.db
      .insert(drivers)
      .values({
        id: driver.id,
        userId: driver.userId,
        cnh: driver.cnh,
        status: driver.status || 'PENDING_APPROVAL',
      })
      .returning();
    return newDriver;
  }
}
