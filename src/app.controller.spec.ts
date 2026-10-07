import { REDIRECT_METADATA } from '@nestjs/common/constants';
import { AppController } from './app.controller';

describe('AppController', () => {
  it('redirects the root route to the Swagger UI', () => {
    const redirectHandler = Object.getOwnPropertyDescriptor(
      AppController.prototype,
      'redirectToDocs',
    )?.value;

    expect(
      Reflect.getMetadata(REDIRECT_METADATA, redirectHandler),
    ).toEqual({ url: '/api/docs', statusCode: 302 });
  });
});
