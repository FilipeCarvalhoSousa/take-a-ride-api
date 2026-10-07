import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserMapper } from '../mapper/user.mapper';
import { UsersRepository } from '../repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
  ) { }

  async findById(id: string) {
    const result = await this.repository.findById(id);

    const user = result[0];

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    return UserMapper.toUserResponse(user);
  }

  async findByEmail(email: string) {
    const result = await this.repository.findByEmail(email);

    const user = result[0];

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    return UserMapper.toUserResponse(user);
  }

  async createNewUser(user: CreateUserDto) {
    const existingUser = await this.repository.findByEmail(user.email);
    if (existingUser.length > 0) {
      throw new ConflictException('Usuário já cadastrado');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);

    const userWithGeneratedId = {
      id: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: passwordHash
    };

    const createdUser = await this.repository.createUser(userWithGeneratedId);
    return UserMapper.toUserResponse(createdUser);
  }
}
