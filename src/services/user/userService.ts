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

  // メールアドレスがすでに使われているかどうかをチェック
  public async checkForDuplicate(userId: number, email: string): Promise<boolean | null | Error> {
    const user = await this.userRepository.getUserById(userId);
    if (user instanceof Error || user === null) {
      return user;
    }

    // メールアドレスが変更されていない場合はfalseを返す
    if (user.email === email) {
      return true;
    }

    // メールアドレスをもとにユーザー情報を取得
    const existEmailUser = await this.userRepository.getUserByEmail(email);
    if (existEmailUser instanceof Error || existEmailUser === null) {
      return existEmailUser;
    }

    // メールアドレスがすでに使われている場合はtrueを返す
    if (existEmailUser) {
      return true;
    }

    // メールアドレスが使われていない場合はfalseを返す
    return false;
  }

  // ユーザー情報の更新
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
