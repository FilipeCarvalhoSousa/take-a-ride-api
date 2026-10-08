import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';

import { UserInterface } from '../interface/user-db.interface';
import { users } from '../../../database/schema/users.schema';

@Injectable()
export class UsersRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByEmail(email: string) {
    return this.database.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }

  async findById(id: string) {
    return this.database.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
  }

  async createUser(user: UserInterface) {
    const [newUser] = await this.database.db
      .insert(users)
      .values(user)
      .returning();

    return newUser;
  }
}
