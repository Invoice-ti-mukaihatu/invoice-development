import { User } from "../../models/users";

export interface IUserService {
  // ログインするさ時のメソッド、正常時トークンを返す。エラーが発生した場合エラーを返す
  checkForDuplicate(userId: number, email: string): Promise<boolean | Error>;
  updateUser(
    userId: number,
    username: string,
    email: string,
    name: string,
    address: string
  ): Promise<void | Error>;
  getUserById(userId: number): Promise<
    | {
      username: string;
      email: string;
      name: string;
      address: string;
    }
    | null
    | Error
  >;
  createUser(user: User): Promise<number | Error>;
}
