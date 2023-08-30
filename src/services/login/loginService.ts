import { User } from "../../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ILoginRepository } from "../../repositories/login/interface";
import { ILoginService } from "./interface";
import * as dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET_KEY } = process.env;
export class LoginService implements ILoginService {
    private loginRepository: ILoginRepository;

    // コンストラクタ: LoginRepositoryのインスタンスを受け取り、プライベート変数に格納
    constructor(loginRepository: ILoginRepository) {
        this.loginRepository = loginRepository;
    }

    // ユーザーログインの処理
    public async login(email: string, password: string): Promise<string | Error> {
        // LoginRepositoryのメソッドを使用して認証を試みる
        const userIdOrError = await this.loginRepository.authenticate(email, password);

        // 認証に失敗した場合、エラーを投げる
        if (userIdOrError instanceof Error) {
            throw userIdOrError;
        }

        // トークン生成のためのペイロードとオプション設定
        const tokenPayload = { id: userIdOrError };
        const tokenOptions = { expiresIn: "30m" };
        const token = jwt.sign(tokenPayload, JWT_SECRET_KEY as string, tokenOptions);

        return token;
    }

    // メールアドレスをもとにユーザー情報を取得
    public async getUserByEmail(email: string): Promise<User | null> {
        return await this.loginRepository.getUserByEmail(email);
    }

    // パスワードの比較
    public async checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}