import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DriversRepository } from '../repository/drivers.repository';
import { CreateDriverDto } from '../dto/create-driver.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../users/repository/users.repository';

@Injectable()
export class DriversService {
  constructor(
    private readonly repository: DriversRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findById(id: string) {
    const result = await this.repository.findById(id);
    console.log('resulot', result);

    const driver = result;

    if (!driver) {
      throw new NotFoundException('Motorista não encontrado');
    }

    return driver;
  }

  async findByEmail(email: string) {
    const result = await this.usersRepository.findByEmail(email);

    const driver = result[0];

    if (!driver) {
      throw new NotFoundException('Motorista não encontrado');
    }

    return driver;
  }

  async createNewDriver(dto: CreateDriverDto) {
    // 1. Verifica se o usuário existe na tabela 'users'
    const user = await this.usersRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    // 2. Verifica se o usuário já possui perfil de motorista cadastrado
    const existingDriverByUserId = await this.repository.findById(dto.userId);
    if (existingDriverByUserId) {
      throw new ConflictException(
        'Este usuário já possui um perfil de motorista cadastrado.',
      );
    }

    // 3. Verifica se a CNH já está cadastrada
    const existingDriverByCnh = await this.repository.findByCnh(dto.cnh);
    if (existingDriverByCnh) {
      throw new ConflictException('Esta CNH já está cadastrada no sistema.');
    }
    // 4. Prepara o objeto com o UUID do motorista e o userId recebido
    const driverWithGeneratedId = {
      id: crypto.randomUUID(),
      userId: dto.userId,
      cnh: dto.cnh,
      status: 'PENDING_APPROVAL' as const,
    };
    return this.repository.createDriver(driverWithGeneratedId);
  }
}
