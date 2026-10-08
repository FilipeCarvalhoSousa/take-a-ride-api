import configuration from './configuration';
import { envSchema } from './env.schema';

describe('configuration', () => {
  const originalEnvironment = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnvironment };
  });

  it('loads the application and database settings from environment variables', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '8080';
    process.env.DATABASE_HOST = 'db.example.com';
    process.env.DATABASE_PORT = '5433';
    process.env.DATABASE_NAME = 'rides';
    process.env.DATABASE_USER = 'app';
    process.env.DATABASE_PASSWORD = 'secret';

    expect(configuration()).toEqual({
      nodeEnv: 'production',
      port: 8080,
      database: {
        host: 'db.example.com',
        port: 5433,
        name: 'rides',
        user: 'app',
        password: 'secret',
      },
    });
  });

  it('applies defaults and rejects missing required database settings', () => {
    const requiredEnvironment = {
      DATABASE_HOST: 'localhost',
      DATABASE_NAME: 'rides',
      DATABASE_USER: 'app',
      DATABASE_PASSWORD: 'secret',
    };

    expect(envSchema.parse(requiredEnvironment)).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      DATABASE_PORT: 5432,
    });
    expect(() => envSchema.parse({})).toThrow();
  });
});
