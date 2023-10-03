import { IUserRepository } from "../../repositories/user/interface";
import { IUserService } from "./interface";
import { User } from "../../models/users";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  // コンストラクタ: UserRepositoryのインスタンスを受け取り、プライベート変数に格納
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // ユーザーの新規登録
  public async createUser(user: User): Promise<number | Error> {
    try {
      // メールアドレスがすでに存在するかチェック
      const existEmailUser = await this.userRepository.getUserByEmail(user.email);
      if (existEmailUser instanceof Error) {
        return existEmailUser;
      }

      if (existEmailUser) {
        return new Error("already exist email");
      }
      // パスワードのハッシュ化
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);

      const userId = await this.userRepository.createUser(user);
      return userId;
    } catch (error) {
      return new Error(`userService.createUser() ERROR: ${error}`);
    }
  }
  // メールアドレスがすでに使われているかどうかをチェック
  public async checkForDuplicate(userId: number, email: string): Promise<boolean | Error> {
    const user = await this.userRepository.getUserById(userId);
    if (user instanceof Error || user === null) {
      return new Error(`User not found`);
    }

    // メールアドレスが変更されていない場合はfalseを返す
    if (user.email === email) {
      return false;
    }

    // メールアドレスをもとにユーザー情報を取得
    const existEmailUser = await this.userRepository.getUserByEmail(email);
    if (existEmailUser instanceof Error) {
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

  // ユーザー情報の更新
  public async updatePassword(userId: number, password: string): Promise<void | Error> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return this.userRepository.updatePassword(userId, hashedPassword);
  }

  // ユーザー情報の取得
  public async getUserById(userId: number): Promise<
    | {
      username: string;
      email: string;
      name: string;
      address: string;
    }
    | null
    | Error
  > {
    const user = await this.userRepository.getUserById(userId);
    if (user instanceof Error || user === null) {
      return user;
    }
    return {
      username: user.username,
      email: user.email,
      name: user.name,
      address: user.address,
    };
  }

  // パスワードの比較
  public async checkPassword(userId: number, plainPassword: string): Promise<boolean> {
    const user = await this.userRepository.getUserById(userId);
    // userが取得できない場合、falseを返す
    if (user instanceof Error || user === null) {
      return false;
    }
    return await bcrypt.compare(plainPassword, user.password);
  }

  public async getUserIcon(userId: number): Promise<string | null | Error> {
    try {
      // ユーザーのアイコンURLをデータベースから取得
      const imageUrl = await this.userRepository.getUserIcon(userId);
      return imageUrl;
    } catch (error) {
      return new Error(`ユーザーアイコンの取得エラー: ${error}`);
    }
  }
}

