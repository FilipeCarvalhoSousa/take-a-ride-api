import { AppService } from './app.service';

describe('AppService', () => {
  const service = new AppService();

  it('returns the hello message', () => {
    expect(service.getHello()).toBe('Hello World!');
  });

  it('returns the configured package version or the default', () => {
    const originalVersion = process.env.npm_package_version;

    try {
      process.env.npm_package_version = '1.2.3';
      expect(service.getVersion()).toEqual({ version: '1.2.3' });

      delete process.env.npm_package_version;
      expect(service.getVersion()).toEqual({ version: '0.0.1' });
    } finally {
      if (originalVersion === undefined) {
        delete process.env.npm_package_version;
      } else {
        process.env.npm_package_version = originalVersion;
      }
    }
  });
});
