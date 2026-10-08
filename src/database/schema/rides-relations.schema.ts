import { relations } from "drizzle-orm";
import { rides } from "./rides.schema";
import { users } from "./users.schema";
import { drivers } from "./drivers.schema";

export const ridesRelations = relations(rides, ({ one }) => ({
  passenger: one(users, {
    fields: [rides.passengerId],
    references: [users.id],
    relationName: 'passengerRides',
  }),
  driver: one(drivers, {
    fields: [rides.driverId],
    references: [drivers.id],
    relationName: 'driverRides',
  }),
}));