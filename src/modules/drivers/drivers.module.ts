import { Module } from '@nestjs/common';
import { DriversController } from './controller/drivers.controller';
import { DriversService } from './services/drivers.service';
import { DriversRepository } from './repository/drivers.repository';
import { UsersRepository } from '../users/repository/users.repository';

@Module({
  providers: [DriversService, DriversRepository, UsersRepository],
  controllers: [DriversController],
})
export class DriversModule {}
