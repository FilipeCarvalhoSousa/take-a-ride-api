import { MODULE_METADATA } from '@nestjs/common/constants';
import { UsersController } from './controller/users.controller';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './service/users.service';
import { UsersModule } from './users.module';

describe('UsersModule', () => {
  it('registers its controller, service, repository, and public service export', () => {
    expect(
      Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, UsersModule),
    ).toContain(UsersController);
    expect(
      Reflect.getMetadata(MODULE_METADATA.PROVIDERS, UsersModule),
    ).toEqual(expect.arrayContaining([UsersService, UsersRepository]));
    expect(Reflect.getMetadata(MODULE_METADATA.EXPORTS, UsersModule)).toContain(
      UsersService,
    );
  });
});
