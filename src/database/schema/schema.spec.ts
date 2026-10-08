import { createTableRelationsHelpers, Many, One } from 'drizzle-orm';
import { getTableName } from 'drizzle-orm';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { cars, carsRelations } from './car.schema';
import { driverStatusEnum, drivers, driversRelations } from './drivers.schema';
import { rideStatusEnum, rides } from './rides.schema';
import { ridesRelations } from './rides-relations.schema';
import { roleEnum, users } from './users.schema';
import { usersRelations } from './users-relations.schema';

describe('database schemas', () => {
  it('defines user columns, role values, and unique account identifiers', () => {
    const config = getTableConfig(users);
    const columns = Object.fromEntries(
      config.columns.map((column) => [column.name, column]),
    );

    expect(config.name).toBe('users');
    expect(roleEnum.enumName).toBe('role');
    expect(roleEnum.enumValues).toEqual(['PASSENGER', 'DRIVER']);
    expect(columns.id).toMatchObject({
      name: 'id',
      notNull: true,
      primary: true,
      hasDefault: true,
    });
    expect(columns.name).toMatchObject({ name: 'name', notNull: true });
    expect(columns.email).toMatchObject({ name: 'email', notNull: true });
    expect(columns.phone).toMatchObject({ name: 'phone', notNull: true });
    expect(columns.role.enumValues).toEqual(roleEnum.enumValues);
    expect(columns.role.default).toBe('PASSENGER');
    expect(columns.password_hash).toMatchObject({
      name: 'password_hash',
      notNull: true,
    });
    expect(columns.email.isUnique).toBe(true);
    expect(columns.phone.isUnique).toBe(true);
  });

  it('defines driver status values, user cascade, and relationship mappings', () => {
    const config = getTableConfig(drivers);
    const foreignKey = config.foreignKeys[0].reference();
    const relations = driversRelations.config(
      createTableRelationsHelpers(drivers),
    );

    expect(config.name).toBe('drivers');
    expect(driverStatusEnum.enumValues).toEqual([
      'PENDING_APPROVAL',
      'APPROVED',
      'SUSPENDED',
      'REJECTED',
    ]);
    expect(
      config.columns.find((column) => column.name === 'status'),
    ).toMatchObject({
      notNull: true,
      hasDefault: true,
      default: 'PENDING_APPROVAL',
    });
    expect(foreignKey.columns.map((column) => column.name)).toEqual([
      'user_id',
    ]);
    expect(getTableName(foreignKey.foreignTable)).toBe('users');
    expect(foreignKey.foreignColumns.map((column) => column.name)).toEqual([
      'id',
    ]);
    expect(config.foreignKeys[0].onDelete).toBe('cascade');
    expect(relations.user).toBeInstanceOf(One);
    expect(relations.user.referencedTableName).toBe('users');
    expect(relations.rides).toBeInstanceOf(Many);
    expect(relations.rides.referencedTableName).toBe('rides');
    expect(relations.rides.relationName).toBe('driverRides');
  });

  it('defines ride statuses, required trip data, and optional assignment/timestamps', () => {
    const config = getTableConfig(rides);
    const columns = Object.fromEntries(
      config.columns.map((column) => [column.name, column]),
    );
    const foreignKeys = config.foreignKeys.map((foreignKey) => {
      const reference = foreignKey.reference();
      return {
        sourceColumn: reference.columns[0].name,
        targetTable: getTableName(reference.foreignTable),
        targetColumn: reference.foreignColumns[0].name,
      };
    });

    expect(config.name).toBe('rides');
    expect(rideStatusEnum.enumValues).toEqual([
      'REQUESTED',
      'ACCEPTED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
    ]);
    expect(columns.status.enumValues).toEqual(rideStatusEnum.enumValues);
    expect(columns.status.default).toBe('REQUESTED');
    expect(columns.passenger_id.notNull).toBe(true);
    expect(columns.driver_id.notNull).toBe(false);
    expect(foreignKeys).toEqual(
      expect.arrayContaining([
        {
          sourceColumn: 'passenger_id',
          targetTable: 'users',
          targetColumn: 'id',
        },
        {
          sourceColumn: 'driver_id',
          targetTable: 'drivers',
          targetColumn: 'id',
        },
      ]),
    );
    expect(columns.origin_address.notNull).toBe(true);
    expect(columns.origin_lat.notNull).toBe(true);
    expect(columns.origin_lng.notNull).toBe(true);
    expect(columns.destination_address.notNull).toBe(true);
    expect(columns.destination_lat.notNull).toBe(true);
    expect(columns.destination_lng.notNull).toBe(true);
    expect(columns.price.notNull).toBe(true);
    expect(columns.distance.notNull).toBe(true);
    expect(columns.duration.notNull).toBe(false);
    expect(columns.started_at.notNull).toBe(false);
    expect(columns.ended_at.notNull).toBe(false);
  });

  it('maps passenger and driver ride relations to their corresponding tables', () => {
    const rideRelations = ridesRelations.config(
      createTableRelationsHelpers(rides),
    );
    const passengerRelations = usersRelations.config(
      createTableRelationsHelpers(users),
    );

    expect(rideRelations.passenger).toBeInstanceOf(One);
    expect(rideRelations.passenger.referencedTableName).toBe('users');
    expect(rideRelations.passenger.config?.fields).toEqual([rides.passengerId]);
    expect(rideRelations.passenger.config?.references).toEqual([users.id]);
    expect(rideRelations.passenger.relationName).toBe('passengerRides');

    expect(rideRelations.driver).toBeInstanceOf(One);
    expect(rideRelations.driver.referencedTableName).toBe('drivers');
    expect(rideRelations.driver.config?.fields).toEqual([rides.driverId]);
    expect(rideRelations.driver.config?.references).toEqual([drivers.id]);
    expect(rideRelations.driver.relationName).toBe('driverRides');

    expect(passengerRelations.passengerRides).toBeInstanceOf(Many);
    expect(passengerRelations.passengerRides.relationName).toBe(
      'passengerRides',
    );
    expect(passengerRelations).not.toHaveProperty('driverRides');
  });

  it('defines cars with unique plates, required driver, and cascading deletion', () => {
    const config = getTableConfig(cars);
    const foreignKey = config.foreignKeys[0].reference();
    const relations = carsRelations.config(createTableRelationsHelpers(cars));
    const columns = Object.fromEntries(
      config.columns.map((column) => [column.name, column]),
    );

    expect(config.name).toBe('cars');
    expect(columns.id).toMatchObject({
      notNull: true,
      primary: true,
      hasDefault: true,
    });
    expect(columns.driver_id.notNull).toBe(true);
    expect(columns.plate.notNull).toBe(true);
    expect(columns.plate.isUnique).toBe(true);
    expect(columns.brand.notNull).toBe(true);
    expect(columns.model.notNull).toBe(true);
    expect(columns.color.notNull).toBe(true);
    expect(columns.year.notNull).toBe(true);
    expect(getTableName(foreignKey.foreignTable)).toBe('drivers');
    expect(foreignKey.columns.map((column) => column.name)).toEqual([
      'driver_id',
    ]);
    expect(foreignKey.foreignColumns.map((column) => column.name)).toEqual([
      'id',
    ]);
    expect(config.foreignKeys[0].onDelete).toBe('cascade');
    expect(relations.driver).toBeInstanceOf(One);
    expect(relations.driver.referencedTableName).toBe('drivers');
    expect(relations.driver.config?.fields).toEqual([cars.driverId]);
    expect(relations.driver.config?.references).toEqual([drivers.id]);
  });
});
