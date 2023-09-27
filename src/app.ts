import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import mysql2, { Connection, RowDataPacket } from "mysql2/promise";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { LoginController } from "./controllers/login/loginController";
import { LoginService } from "./services/login/loginService";
import { LoginRepository } from "./repositories/login/loginRepository";
import { UserRepository } from "./repositories/user/userRepository";
import { UserService } from "./services/user/userService";
import { UserController } from "./controllers/user/userController";

async function main() {
  //.envファイルの読み込み
  dotenv.config();
  const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASS,
    MYSQL_DB,
    FRONT_BASE_URL,
    PORT
  } = process.env;
  // expressモジュールのインスタンスを生成して、appという名前の変数に格納しています。
  const app: express.Express = express();

  // ヘッダーの表示を消す
  app.disable("x-powered-by");
  // jsonの送信を許可
  app.use(
    cors({
      credentials: true,
      origin: FRONT_BASE_URL,
    })
  );

  // アプリケーションを開始し、ポート3000解放
  app.listen(PORT, () => {
    console.log(`Start on port ${PORT}.`);
  });

  // データベースに接続,mysql2のモジュールを使ってデータベース情報を変数connectionに入れる
  const connection: Connection = await mysql2.createConnection({
    host: MYSQL_HOST as string,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
  });

  // ミドルウェア設定: JSONリクエストのパースとクッキーのパース
  app.use(bodyParser.json());
  app.use(cookieParser());

  const loginRepository = new LoginRepository(connection);
  const loginService = new LoginService(loginRepository);
  const loginController = new LoginController(loginService);
  //ログインのエンドポイント
  app.use('/api', loginController.getRouter());
  const userRepository = new UserRepository(connection);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  // ユーザー編集のエンドポイント
  app.use("/api", userController.getRouter());

  // usersのレコードをすべてを取得する（GET）
  app.get("/users", async (req, res) => {
    try {
      const sql = "select * from users";
      const [result] = await connection.query<RowDataPacket[]>(sql);

      res.json(result);
    } catch (error) {
      console.error("Error while fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
main();
