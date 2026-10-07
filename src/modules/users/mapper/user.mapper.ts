import { User } from "../../../database/schema/users.schema";
import { UserResponseInterface } from "../repository/user-response.interface";

export class UserMapper {
  static toUserResponse(user: User): UserResponseInterface {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

