import { relations } from "drizzle-orm";
import { users, rides } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  passengerRides: many(rides, { relationName: 'passengerRides' }),
  driverRides: many(rides, { relationName: 'driverRides' }),
}));