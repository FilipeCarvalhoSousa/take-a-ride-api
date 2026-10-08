import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { rides } from './rides.schema';


// Status de aprovação da conta do motorista no app
export const driverStatusEnum = pgEnum('driver_status', [
  'PENDING_APPROVAL',
  'APPROVED',
  'SUSPENDED',
  'REJECTED',
]);

export const drivers = pgTable('drivers', { id: uuid('id').defaultRandom().primaryKey(), userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }), cnh: varchar('cnh', { length: 20 }).notNull().unique(), status: driverStatusEnum('status').default('PENDING_APPROVAL').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(), });

// Relacionamentos para consultas avançadas do Drizzle
export const driversRelations = relations(drivers, ({ one, many }) => ({
  user: one(users, {
    fields: [drivers.userId],
    references: [users.id],
  }),
  rides: many(rides, { relationName: 'driverRides' }),
}));

export type Driver = typeof drivers.$inferSelect;
export type NewDriver = typeof drivers.$inferInsert;