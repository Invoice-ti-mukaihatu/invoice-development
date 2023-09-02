import { User } from "../../models/users";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null | Error>;
  updateUser(
    userId: number,
    username: string,
    email: string,
    name: string,
    address: string
  ): Promise<void | Error>;
}
