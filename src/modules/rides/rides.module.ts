import { Module } from '@nestjs/common';
import { RidesService } from './service/rides.service';
import { RidesController } from './controller/rides.controller';

@Module({
  providers: [RidesService],
  controllers: [RidesController]
})
export class RidesModule { }
