import { User } from "../../models/users";
import { RowDataPacket, Connection, ResultSetHeader } from "mysql2/promise";
import { IUserRepository } from "./interface";

export class UserRepository implements IUserRepository {
  private connection: Connection;

  // コンストラクタでデータベース接続を受け取り保存
  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async createUser(user: User): Promise<number | Error> {
    try {
      const sql = "INSERT INTO users SET ?";
      const [result] = await this.connection.query<ResultSetHeader>(sql, user);
      return result.insertId;
    } catch (error) {
      return new Error(`userRepository.createUser() ERROR: ${error}`);
    }
  }

  // idをもとにユーザー情報を取得するメソッドの実装
  public async getUserById(id: number): Promise<User | null | Error> {
    try {
      const sql = "SELECT * FROM users WHERE id = ?";
      const [rows] = await this.connection.query<RowDataPacket[]>(sql, [id]);
      if (rows.length === 0) {
        return null;
      }

      const user = rows[0] as User;
      return user;
    } catch (error) {
      return new Error(`UserRepository.getUserById() ERROR: ${error}`);
    }
  }

  // メールアドレスをもとにユーザー情報を取得するメソッドの実装
  public async getUserByEmail(email: string): Promise<User | null | Error> {
    try {
      const sql = "SELECT * FROM users WHERE email = ?";
      const [rows] = await this.connection.query<RowDataPacket[]>(sql, [email]);
      if (rows.length === 0) {
        return null;
      }

      const user = rows[0] as User;
      return user;
    } catch (error) {
      return new Error(`UserRepository.getUserByEmail() ERROR: ${error}`);
    }
  }

  public async updateUser(
    userId: number,
    username: string,
    email: string,
    name: string,
    address: string
  ): Promise<void | Error> {
    try {
      const sql = "UPDATE users SET username = ?, email = ?, name = ?, address = ? WHERE id = ?";
      await this.connection.query<RowDataPacket[]>(sql, [username, email, name, address, userId]);
    } catch (error) {
      return new Error(`userRepository.updateUser() ERROR: ${error}`);
    }
  }

  public async updatePassword(userId: number, hashedPassword: string): Promise<void | Error> {
    try {
      const sql = "UPDATE users SET password = ? WHERE id = ?";
      await this.connection.query<RowDataPacket[]>(sql, [hashedPassword, userId]);
    } catch (error) {
      return new Error(`userRepository.updatePassword() ERROR: ${error}`);
    }
  }
}
