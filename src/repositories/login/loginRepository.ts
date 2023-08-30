import { User } from "../../models/users";
import { RowDataPacket, Connection } from "mysql2/promise";
import bcrypt from "bcrypt";
import { ILoginRepository } from "./interface";

export class LoginRepository implements ILoginRepository {
    private connection: Connection;

    // コンストラクタでデータベース接続を受け取り保存
    constructor(connection: Connection) {
        this.connection = connection;
    }

    // メールアドレスをもとにユーザー情報を取得するメソッドの実装
    public async getUserByEmail(email: string): Promise<User | null> {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await this.connection.query<RowDataPacket[]>(sql, [email]);

        if (rows.length === 0) {
            return null;
        }

        const user = rows[0] as User;
        return user;
    }

    // ユーザーの認証を行うメソッドの実装
    public async authenticate(email: string, password: string): Promise<number | Error> {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await this.connection.query<RowDataPacket[]>(sql, [email]);

        if (rows.length === 0) {
            return new Error("User not found");
        }

        const user = rows[0];
        //&&の後ろはパスワードの比較を行うための処理
        if (user && await bcrypt.compare(password, user.password)) {
            return user.id;
        } else {
            return new Error("Authentication failed");
        }
    }
}
