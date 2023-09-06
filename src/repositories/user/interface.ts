import { User } from "../../models/users";

export interface IUserRepository {
  getUserById(id: number): Promise<User | null | Error>;
  getUserByEmail(email: string): Promise<User | null | Error>;
  updateUser(
    userId: number,
    username: string,
    email: string,
    name: string,
    address: string
  ): Promise<void | Error>;
}
