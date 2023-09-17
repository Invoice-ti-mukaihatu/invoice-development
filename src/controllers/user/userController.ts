import { Request, Response, Router } from "express";
import { IUserService } from "../../services/user/interface";
import { authorization } from "../middlewares/auth";

// ExpressのRouterインスタンスを作成
export class UserController {
  public router: Router;
  private userService: IUserService;

  // UserControllerのコンストラクタ。IUserServiceのインスタンスを受け取り,ルーターとしてのrouterも初期化する
  constructor(userService: IUserService) {
    this.userService = userService;
    this.router = Router();

    // POSTリクエスト(/user)が来たときの処理
    this.router.put("/users", authorization, async (req: Request, res: Response) => {
      try {
        const { username, email, name, address } = req.body;
        if (!username || !email || !name || !address) {
          return res
            .status(400)
            .json({ error: "ユーザー名、メールアドレス、氏名、住所は必須項目です。" });
        }

        // tokenを取得
        const userId = req.body.payload.id as number;

        // メールアドレスがすでに使われているかどうかをチェック
        const existEmailUser = await userService.checkForDuplicate(userId, email);

        if (existEmailUser instanceof Error) {
          return res.status(500).json({ error: "内部サーバーエラー" });
        }

        if (existEmailUser) {
          return res.status(400).json({ error: "このメールアドレスはすでに使われています。" });
        }

        // ユーザー情報の更新
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
