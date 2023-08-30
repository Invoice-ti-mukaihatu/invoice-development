import { User } from "../../models/users";

export interface ILoginService {
    // ログインするさ時のメソッド、正常時トークンを返す。エラーが発生した場合エラーを返す
    login(email: string, password: string): Promise<string | Error>;
    getUserByEmail(email: string): Promise<User | null>;
    //渡されたパスとハッシュ化されたパスを比較するメソッド、一致したらtrue、一致しなかったらfalseを返す
    checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}