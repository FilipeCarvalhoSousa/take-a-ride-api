import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersRepository } from '../users/repository/users.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'take_a_ride_secret_key_df_2026_super_secure_token',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, UsersRepository],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
