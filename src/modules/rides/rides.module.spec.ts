import { MODULE_METADATA } from '@nestjs/common/constants';
import { UsersRepository } from '../users/repository/users.repository';
import { UsersService } from '../users/service/users.service';
import { RidesController } from './controller/rides.controller';
import { RidesGateway } from './gateway/rides.gateway';
import { RidesRepository } from './repository/rides.repository';
import { RidesService } from './service/rides.service';
import { RidesModule } from './rides.module';

describe('RidesModule', () => {
  it('registers the ride controller, service dependencies, gateway, and export', () => {
    expect(
      Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, RidesModule),
    ).toContain(RidesController);
    expect(
      Reflect.getMetadata(MODULE_METADATA.PROVIDERS, RidesModule),
    ).toEqual(
      expect.arrayContaining([
        RidesService,
        RidesRepository,
        UsersService,
        UsersRepository,
        RidesGateway,
      ]),
    );
    expect(Reflect.getMetadata(MODULE_METADATA.EXPORTS, RidesModule)).toContain(
      RidesService,
    );
  });
});
