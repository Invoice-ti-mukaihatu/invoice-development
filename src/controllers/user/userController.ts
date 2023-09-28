import { Request, Response, Router } from "express";
import { IUserService } from "../../services/user/interface";
import { authorization } from "../middlewares/auth";

export class UserController {
  public router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
    this.router = Router();

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
          return res.status(404).json(existEmailUser.message);
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
        console.error("ユーザー情報の更新中にエラーが発生しました:", error);
        return res.status(500).json({ error: "内部サーバーエラー" });
      }
    });

    this.router.put("/users/password", authorization, async (req: Request, res: Response) => {
      try {
        const { oldPassword, newPassword } = req.body;
        // 必須項目をチェック
        if (!oldPassword || !newPassword) {
          return res
            .status(400)
            .json({ error: "現在のパスワード、新しいパスワードの確認は必須項目です" });
        }

        // tokenを取得
        const userId = req.body.payload.id as number;

        // パスワードが正しいかどうかをチェック
        const isMatchPassword = await this.userService.checkPassword(userId, oldPassword);
        if (!isMatchPassword) {
          return res.status(400).json({ error: "現在のパスワードが一致しません" });
        }

        // ユーザー情報の更新
        const user = await this.userService.updatePassword(userId, newPassword);

        if (user instanceof Error) {
          return res.status(500).json({ error: "内部サーバーエラー" });
        }

        return res.status(200).json("ok");
      } catch (error) {
        console.error("パスワードの更新中にエラーが発生しました:", error);
        return res.status(500).json({ error: "内部サーバーエラー" });
      }
    });

    this.router.get("/users/me", authorization, async (req: Request, res: Response) => {
      try {
        // tokenを取得
        const userId = req.body.payload.id as number;

        // ユーザー情報の更新
        const user = await this.userService.getUserById(userId);

        if (user instanceof Error) {
          return res.status(500).json({ error: "内部サーバーエラー" });
        }

        if (user === null) {
          return res.status(404).json({ error: "このユーザーは存在しません" });
        }

        return res.status(200).json(user);
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
