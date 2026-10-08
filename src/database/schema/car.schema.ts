import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { drivers } from './drivers.schema';


export const cars = pgTable('cars', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Chave estrangeira vinculando o carro ao motorista
  driverId: uuid('driver_id')
    .notNull()
    .references(() => drivers.id, { onDelete: 'cascade' }),

  plate: varchar('plate', { length: 10 }).notNull().unique(), // Placa
  brand: varchar('brand', { length: 50 }).notNull(),          // Ex: Toyota
  model: varchar('model', { length: 50 }).notNull(),          // Ex: Corolla / Etios
  color: varchar('color', { length: 30 }).notNull(),          // Ex: Prata
  year: integer('year').notNull(),                            // Ex: 2020

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relacionamentos do Drizzle
export const carsRelations = relations(cars, ({ one }) => ({
  driver: one(drivers, {
    fields: [cars.driverId],
    references: [drivers.id],
  }),
}));

export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;