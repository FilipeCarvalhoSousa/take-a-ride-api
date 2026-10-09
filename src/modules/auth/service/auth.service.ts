import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { UsersRepository } from '../../users/repository/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserAndLogin(dto: LoginDto) {
    // 1. Busca o usuário pelo e-mail
    const users = await this.usersRepository.findByEmail(dto.email);
    const user = users[0];
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 2. Compara a senha informada com o hash salvo no PostgreSQL
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 3. Monta o Payload e assina o Token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
