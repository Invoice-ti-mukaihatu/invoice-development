import { Request, Response, Router } from "express";
import { IUserService } from "../../services/user/interface";

// ExpressのRouterインスタンスを作成
export class UserController {
  public router: Router;
  private userService: IUserService;

  // UserControllerのコンストラクタ。IUserServiceのインスタンスを受け取り,ルーターとしてのrouterも初期化する
  constructor(userService: IUserService) {
    this.userService = userService;
    this.router = Router();

    // POSTリクエスト(/user)が来たときの処理
    this.router.put("/", async (req: Request, res: Response) => {
      try {
        const { username, email, name, address } = req.body;

        if (!username || !email || !name || !address) {
          return res
            .status(400)
            .json({ error: "ユーザー名、メールアドレス、氏名、住所は必須項目です。" });
        }

        const existEmailUser = await userService.getUserByEmail(email);

        if (existEmailUser instanceof Error) {
          return res.status(500).json({ error: "内部サーバーエラー" });
        }

        if (existEmailUser) {
          return res.status(400).json({ error: "このメールアドレスはすでに使われています。" });
        }

        // tokenからuser_idを取得
        const userId = 1;

        // ユーザー情報のメールを取得
        const user = await this.userService.updateUser(userId, username, email, name, address);

        if (user instanceof Error) {
          return res.status(500).json({ error: "内部サーバーエラー" });
        }

        return res.status(200).json("ok");
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
