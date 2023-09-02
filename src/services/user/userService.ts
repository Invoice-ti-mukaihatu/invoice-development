import { User } from "../../models/users";
import { IUserRepository } from "../../repositories/user/interface";
import { IUserService } from "./interface";
import * as dotenv from "dotenv";

dotenv.config();

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  // コンストラクタ: UserRepositoryのインスタンスを受け取り、プライベート変数に格納
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // メールアドレスをもとにユーザー情報を取得
  public async getUserByEmail(email: string): Promise<User | null | Error> {
    return await this.userRepository.getUserByEmail(email);
  }

  // ユーザーログインの処理
  public async updateUser(
    userId: number,
    username: string,
    email: string,
    name: string,
    address: string
  ): Promise<void | Error> {
    return this.userRepository.updateUser(userId, username, email, name, address);
  }
}
