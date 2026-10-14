import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DriversRepository } from '../repository/drivers.repository';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UsersRepository } from '../../users/repository/users.repository';

@Injectable()
export class DriversService {
  constructor(
    private readonly repository: DriversRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findById(id: string) {
    const result = await this.repository.findById(id);
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
    const user = await this.usersRepository.findById(dto.userId);
    if (user.length === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const existingDriverByUserId = await this.repository.findById(dto.userId);
    if (existingDriverByUserId) {
      throw new ConflictException(
        'Este usuário já possui um perfil de motorista cadastrado.',
      );
    }

    const existingDriverByCnh = await this.repository.findByCnh(dto.cnh);
    if (existingDriverByCnh) {
      throw new ConflictException('Esta CNH já está cadastrada no sistema.');
    }
    const driverWithGeneratedId = {
      id: crypto.randomUUID(),
      userId: dto.userId,
      cnh: dto.cnh,
      role: 'DRIVER' as const,
      status: 'PENDING_APPROVAL' as const,
    };
    // 1. Cria o registro de motorista na tabela 'drivers'
    const newDriver = await this.repository.createDriver(driverWithGeneratedId);

    // 2. ⚡ Atualiza o papel do usuário na tabela 'users' para 'DRIVER'
    await this.repository.updateRole(dto.userId, 'DRIVER');

    return newDriver;
  }
}
