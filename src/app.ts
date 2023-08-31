import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { ResultSetHeader } from "mysql2";
import mysql2, { Connection, RowDataPacket } from "mysql2/promise";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { LoginController } from './controllers/login/loginController';
import { LoginService } from './services/login/loginService';
import { LoginRepository } from './repositories/login/loginRepository';
import bcrypt from "bcrypt";

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

  // ユーザー新規登録のエンドポイント
  app.post("/users", async (req, res) => {
    try {
      const { email, password } = req.body;

      // パスワードのハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = { email, password: hashedPassword };

      // ユーザー情報のデータベースへの挿入
      const sql = 'insert into users set ?';
      const [result] = await connection.query<ResultSetHeader>(sql, user);

      res.status(201).json(result.insertId);
    } catch (error: unknown) {
      if (error instanceof Error && entryError(error)) {
        return res.status(400).json({ error: "このメールアドレスは既に登録されています。" });
      } else {
        console.error("Error while inserting user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

  function entryError(error: Error): boolean {
    return error.message.includes('ER_DUP_ENTRY');
  }

  // usersのレコードをすべてを取得する（GET）
  app.get("/users", async (req, res) => {
    try {
      const sql = 'select * from users';
      const [result] = await connection.query<RowDataPacket[]>(sql);

      res.json(result);
    } catch (error) {
      console.error("Error while fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
main();
