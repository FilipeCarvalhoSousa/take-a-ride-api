import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  const configuration: Record<string, string | number> = {
    'database.host': 'localhost',
    'database.port': 5432,
    'database.name': 'take_a_ride_test',
    'database.user': 'test-user',
    'database.password': 'test-password',
  };
  const configService = {
    getOrThrow: jest.fn((key: string) => configuration[key]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('creates a Drizzle database client using the configured connection', () => {
    expect(service.db).toBeDefined();
    expect(configService.getOrThrow).toHaveBeenCalledWith('database.host');
    expect(configService.getOrThrow).toHaveBeenCalledWith('database.port');
    expect(configService.getOrThrow).toHaveBeenCalledWith('database.name');
    expect(configService.getOrThrow).toHaveBeenCalledWith('database.user');
    expect(configService.getOrThrow).toHaveBeenCalledWith(
      'database.password',
    );
  });

  it('closes the connection pool when the module is destroyed', async () => {
    await expect(service.onModuleDestroy()).resolves.toBeUndefined();
  });
});
