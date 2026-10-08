import { MODULE_METADATA } from '@nestjs/common/constants';
import { DriversController } from './controller/drivers.controller';
import { DriversRepository } from './repository/drivers.repository';
import { DriversService } from './services/drivers.service';
import { DriversModule } from './drivers.module';
import { UsersRepository } from '../users/repository/users.repository';

describe('DriversModule', () => {
  it('registers the driver controller and its required providers', () => {
    expect(
      Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, DriversModule),
    ).toContain(DriversController);
    expect(
      Reflect.getMetadata(MODULE_METADATA.PROVIDERS, DriversModule),
    ).toEqual(
      expect.arrayContaining([
        DriversService,
        DriversRepository,
        UsersRepository,
      ]),
    );
  });
});
