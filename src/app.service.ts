import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getVersion(): { version: string } {
    return { version: process.env.npm_package_version ?? '0.0.1' };
  }
}
