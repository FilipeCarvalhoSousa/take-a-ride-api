// src/database/schema.ts
import { pgTable, uuid, text, doublePrecision, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums do Banco de Dados
export const roleEnum = pgEnum('role', ['PASSENGER', 'DRIVER']);
export const rideStatusEnum = pgEnum('ride_status', [
  'REQUESTED',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

// Tabela de Usuários
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  role: roleEnum('role').default('PASSENGER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de Corridas
export const rides = pgTable('rides', {
  id: uuid('id').defaultRandom().primaryKey(),
  passengerId: uuid('passenger_id').notNull().references(() => users.id),
  driverId: uuid('driver_id').references(() => users.id),
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

// Relacionamentos para consultas avançadas com Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  passengerRides: many(rides, { relationName: 'passengerRides' }),
  driverRides: many(rides, { relationName: 'driverRides' }),
}));

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

// Exportação dos tipos do TypeScript gerados automaticamente a partir do schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Ride = typeof rides.$inferSelect;
export type NewRide = typeof rides.$inferInsert;
export type RideStatus = 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';