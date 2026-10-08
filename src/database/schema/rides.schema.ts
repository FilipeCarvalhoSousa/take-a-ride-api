// src/database/schema.ts
import { doublePrecision, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { drivers } from './drivers.schema';
import { users } from './users.schema';

// Enums do Banco de Dados
export const rideStatusEnum = pgEnum('ride_status', [
  'REQUESTED',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const rides = pgTable('rides', {
  id: uuid('id').defaultRandom().primaryKey(),
  passengerId: uuid('passenger_id').notNull().references(() => users.id),
  driverId: uuid('driver_id').references(() => drivers.id),
  status: rideStatusEnum('status').default('REQUESTED').notNull(),

  originAddress: text('origin_address').notNull(),
  originLat: doublePrecision('origin_lat').notNull(),
  originLng: doublePrecision('origin_lng').notNull(),

  destinationAddress: text('destination_address').notNull(),
  destinationLat: doublePrecision('destination_lat').notNull(),
  destinationLng: doublePrecision('destination_lng').notNull(),

  price: doublePrecision('price').notNull(),
  distance: doublePrecision('distance').notNull(),
  duration: integer('duration'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
});

// Exportação dos tipos do TypeScript gerados automaticamente a partir do schema
export type Ride = typeof rides.$inferSelect;
export type NewRide = typeof rides.$inferInsert;
export type RideStatus = 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';