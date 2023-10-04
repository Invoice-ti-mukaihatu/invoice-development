import { Request, Response, Router } from "express";
import { IUserService } from "../../services/user/interface";
import { authorization } from "../middlewares/auth";

export class UserController {
  public router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
    this.router = Router();

    // POSTリクエスト(/create)が来たときの処理
    this.router.post("/create", async (req: Request, res: Response) => {
      try {
        const { name, email, password, address, username } = req.body;
        if (!name || !email || !password || !address || !username) {
          return res
            .status(400)
            .json({ error: "氏名、メールアドレス、パスワード、住所、ユーザー名は必須項目です。" });
        }

        const user = { name, email, password, address, username };

        // ユーザーの新規登録
        const result = await this.userService.createUser(user);

        if (result instanceof Error) {
          if (result.message === "already exist email") {
            return res.status(400).json({ error: "このメールアドレスは既に登録されています。" });
          }
          return res.status(500).json({ error: "内部サーバーエラー" });
        }

        return res.status(201).json(result);
      } catch (error) {
        return res.status(500).json({ error: "内部サーバーエラー" });
      }
    });

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

    this.router.get("/users/icon", authorization, async (req: Request, res: Response) => {
      try {
        // トークンからuserIdを取得
        const userId = req.body.payload.id as number;
        const imageUrl = await this.userService.getUserIcon(userId);

        if (imageUrl instanceof Error) {
          return res.status(500).json({ error: "内部サーバーエラー" });
        }

        if (!imageUrl) {
          return res.status(404).json({ error: "画像が見つかりません" });
        }

        return res.status(200).json({ image_url: imageUrl });
      } catch (error) {
        console.error("ユーザーアイコンの取得中にエラーが発生しました:", error);
        return res.status(500).json({ error: "内部サーバーエラー" });
      }
    });
  }

  public getRouter() {
    return this.router;
  }
}
