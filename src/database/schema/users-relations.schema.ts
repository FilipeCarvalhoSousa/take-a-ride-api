import { relations } from "drizzle-orm";
import { rides } from "./rides.schema";
import { users } from "./users.schema";


export const usersRelations = relations(users, ({ many }) => ({
  passengerRides: many(rides, { relationName: 'passengerRides' }),
}));