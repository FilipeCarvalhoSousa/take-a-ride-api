import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import * as schema from '../../../database/schema/schema';
import { CreateRideDto } from '../dto/create-ride.dto';


@Injectable()
export class RidesService {
  constructor(
  ) { }

  // 1. Criar uma nova corrida no banco de dados
  
}
