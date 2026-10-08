import { MODULE_METADATA } from '@nestjs/common/constants';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { RidesModule } from './modules/rides/rides.module';
import { UsersModule } from './modules/users/users.module';

describe('AppModule', () => {
  it('registers global configuration and all application feature modules', async () => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule);
    const configModule = await imports[0];

    expect(configModule).toEqual(
      expect.objectContaining({
        module: ConfigModule,
        global: true,
      }),
    );
    expect(imports.slice(1)).toEqual(
      expect.arrayContaining([
        DatabaseModule,
        RidesModule,
        UsersModule,
        DriversModule,
      ]),
    );
  });

  it('registers the application controller and service', () => {
    expect(
      Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, AppModule),
    ).toContain(AppController);
    expect(Reflect.getMetadata(MODULE_METADATA.PROVIDERS, AppModule)).toContain(
      AppService,
    );
  });
});
