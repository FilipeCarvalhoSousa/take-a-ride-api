import { Test, TestingModule } from '@nestjs/testing';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { DriversService } from '../services/drivers.service';
import { DriversController } from './drivers.controller';

describe('DriversController', () => {
  let controller: DriversController;
  const service = {
    createNewDriver: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [{ provide: DriversService, useValue: service }],
    }).compile();

    controller = module.get<DriversController>(DriversController);
  });

  it('delegates id lookup to the service', async () => {
    service.findById.mockResolvedValue({ id: 'driver-id' });

    await expect(controller.findById('driver-id')).resolves.toEqual({
      id: 'driver-id',
    });
    expect(service.findById).toHaveBeenCalledWith('driver-id');
  });

  it('delegates email lookup to the service', async () => {
    service.findByEmail.mockResolvedValue({ email: 'driver@example.com' });

    await expect(
      controller.findByEmail('driver@example.com'),
    ).resolves.toEqual({ email: 'driver@example.com' });
    expect(service.findByEmail).toHaveBeenCalledWith('driver@example.com');
  });

  it('delegates driver creation to the service', async () => {
    const dto: CreateDriverDto = {
      userId: 'user-id',
      cnh: '12345678901',
    };
    service.createNewDriver.mockResolvedValue({ id: 'driver-id' });

    await expect(controller.createNewDriver(dto)).resolves.toEqual({
      id: 'driver-id',
    });
    expect(service.createNewDriver).toHaveBeenCalledWith(dto);
  });
});
