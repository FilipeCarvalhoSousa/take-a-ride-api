const mockDocument = { openapi: '3.0.0' };
const mockApp = {
  listen: jest.fn().mockResolvedValue(undefined),
};
const mockCreateCalls: unknown[] = [];
const mockCreateDocumentCalls: unknown[][] = [];
const mockSetupCalls: unknown[][] = [];

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: (module: unknown) => {
      mockCreateCalls.push(module);
      return Promise.resolve(mockApp);
    },
  },
}));

jest.mock('@nestjs/swagger', () => ({
  ...jest.requireActual('@nestjs/swagger'),
  SwaggerModule: {
    createDocument: (app: unknown, config: unknown) => {
      mockCreateDocumentCalls.push([app, config]);
      return mockDocument;
    },
    setup: (...args: unknown[]) => mockSetupCalls.push(args),
  },
}));

describe('main bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    mockApp.listen.mockClear();
    mockCreateCalls.length = 0;
    mockCreateDocumentCalls.length = 0;
    mockSetupCalls.length = 0;
  });

  async function runBootstrap(port?: string) {
    const { AppModule } = await import('./app.module');
    if (port === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = port;
    }
    await import('./main');
    await new Promise<void>((resolve) => setImmediate(resolve));

    return AppModule;
  }

  it('creates the application, configures Swagger, and listens on the configured port', async () => {
    const originalPort = process.env.PORT;
    process.env.PORT = '4321';

    try {
      const AppModule = await runBootstrap('4321');

      expect(mockCreateCalls).toEqual([AppModule]);
      expect(mockCreateDocumentCalls).toEqual([
        [
          mockApp,
          expect.objectContaining({
            info: expect.objectContaining({
              title: 'Take a Ride API',
              description: 'Documentação da API Take a Ride.',
              version: '1.0',
            }),
          }),
        ],
      ]);
      expect(mockSetupCalls).toEqual([['api/docs', mockApp, mockDocument]]);
      expect(mockApp.listen).toHaveBeenCalledWith('4321');
    } finally {
      if (originalPort === undefined) {
        delete process.env.PORT;
      } else {
        process.env.PORT = originalPort;
      }
    }
  });

  it('uses port 3000 when no port is configured', async () => {
    const originalPort = process.env.PORT;
    delete process.env.PORT;

    try {
      await runBootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
    } finally {
      if (originalPort !== undefined) {
        process.env.PORT = originalPort;
      }
    }
  });
});
