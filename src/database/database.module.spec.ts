import {
  GLOBAL_MODULE_METADATA,
  MODULE_METADATA,
} from '@nestjs/common/constants';
import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';

describe('DatabaseModule', () => {
  it('is global and exports its database provider', () => {
    expect(Reflect.getMetadata(GLOBAL_MODULE_METADATA, DatabaseModule)).toBe(
      true,
    );
    expect(
      Reflect.getMetadata(MODULE_METADATA.PROVIDERS, DatabaseModule),
    ).toContain(DatabaseService);
    expect(
      Reflect.getMetadata(MODULE_METADATA.EXPORTS, DatabaseModule),
    ).toContain(DatabaseService);
  });
});
