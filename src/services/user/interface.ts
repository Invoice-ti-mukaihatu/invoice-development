import { User } from "../../models/users";

export interface IUserService {
  // ログインするさ時のメソッド、正常時トークンを返す。エラーが発生した場合エラーを返す
  getUserByEmail(email: string): Promise<User | null | Error>;
  updateUser(
    userId: number,
    username: string,
    email: string,
    name: string,
    address: string
  ): Promise<void | Error>;
}
