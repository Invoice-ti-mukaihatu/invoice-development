import { User } from "../../models/users";

export interface ILoginRepository {
    // ユーザーの認証を行うためのメソッド,引数としてメールアドレスとパスワードを受け取り認証結果をPromiseで返す
    authenticate(email: string, password: string): Promise<number | Error>;
    // メールアドレスをもとにユーザー情報を取得するためのメソッド
    // 引数としてメールアドレスを受け取り、該当するユーザー情報をPromiseで返す,該当するユーザーが存在しない場合はnullを返すこともある
    getUserByEmail(email: string): Promise<User | null>;
}