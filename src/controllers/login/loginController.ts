import { Request, Response, Router } from "express";
import { LoginService } from "../../services/login/loginService";

// ExpressのRouterインスタンスを作成
export class LoginController {
  public router: Router;
  private loginService: LoginService;

  // LoginControllerのコンストラクタ。LoginServiceのインスタンスを受け取り,ルーターとしてのrouterも初期化する
  constructor(loginService: LoginService) {
    this.loginService = loginService;
    this.router = Router();

    // POSTリクエスト(/login)が来たときの処理
    this.router.post("/login", async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;

        // メールアドレスとパスワードの存在チェック
        if (!email || !password) {
          return res.status(400).json({ error: "メールアドレスとパスワードが必要です。" });
        }

        // ユーザー情報のメールを取得
        const user = await this.loginService.getUserByEmail(email);

        // データベースに該当のメールアドレスが存在しない場合のエラーハンドリング
        if (!user) {
          return res.status(401).json({ error: "メールアドレスまたはパスワードが違います。" });
        }

        // パスワードの一致チェック
        const passwordMatch = await this.loginService.checkPassword(password, user.password);

        // パスワードが一致しない場合のエラーハンドリング
        if (!passwordMatch) {
          return res.status(401).json({ error: "メールアドレスまたはパスワードが違います。" });
        }

        // 認証成功時の処理
        const tokenOrError = await this.loginService.login(email, password);

        // 認証エラー時の処理
        if (tokenOrError instanceof Error) {
          return res.status(401).json({ error: "認証に失敗しました。" });
        }

        // トークンをクッキーに設定して返す
        res.cookie("token", tokenOrError, {
          maxAge: 30 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

        return res.status(200).json({ token: tokenOrError });
      } catch (error) {
        console.error("ログイン中にエラーが発生しました:", error);
        return res.status(500).json({ error: "内部サーバーエラー" });
      }
    });
  }

  public getRouter() {
    return this.router;
  }
}
