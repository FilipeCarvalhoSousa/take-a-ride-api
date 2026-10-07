import { relations } from "drizzle-orm";
import { rides, users } from "./schema";

export const ridesRelations = relations(rides, ({ one }) => ({
  passenger: one(users, {
    fields: [rides.passengerId],
    references: [users.id],
    relationName: 'passengerRides',
  }),
  driver: one(users, {
    fields: [rides.driverId],
    references: [users.id],
    relationName: 'driverRides',
  }),
}));