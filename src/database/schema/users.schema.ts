// src/database/schema.ts
import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Enums do Banco de Dados
export const roleEnum = pgEnum('role', ['PASSENGER', 'DRIVER']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  role: roleEnum('role').default('PASSENGER').notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, }).defaultNow().notNull(),
});


// Exportação dos tipos do TypeScript gerados automaticamente a partir do schema
export type User = typeof users.$inferSelect;