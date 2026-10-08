import { Module } from '@nestjs/common';
import { RidesService } from './service/rides.service';
import { RidesController } from './controller/rides.controller';
import { RidesRepository } from './repository/rides.repository';
import { UsersService } from '../users/service/users.service';
import { UsersRepository } from '../users/repository/users.repository';
import { RidesGateway } from './gateway/rides.gateway';

@Module({
  controllers: [RidesController],
  providers: [
    RidesService,
    RidesRepository,
    UsersService,
    UsersRepository,
    RidesGateway,
  ],
  exports: [RidesService],
})
export class RidesModule {}
