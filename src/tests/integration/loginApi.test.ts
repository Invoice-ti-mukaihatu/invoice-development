//import文
import axios from "axios";
import * as dotenv from "dotenv";
import { Connection } from "mysql2/promise";
import { ResultSetHeader } from "mysql2";
import { createDBConnection } from "../utils/Database/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//envファイルの読み込み
dotenv.config();
//envファイルの「PORT」を変数に代入
const { PORT, JWT_SECRET_KEY } = process.env;

//axios→非同期処理 下で登場するURLを短くするために書いてるよ！書かなくてもいいよ○
axios.defaults.withCredentials = true;
axios.defaults.baseURL = `http://localhost:${PORT}/api`;
//APIテスターでも入ってるよね？
axios.defaults.headers.common = { "Content-Type": "application/json" };
//ステータスコードの許容値の設定
axios.defaults.validateStatus = (status: number) => status >= 200 && status < 500;

let connection: Connection;

//全部のテストに共通の前処理
beforeEach(async () => {
  //DB接続開始
  connection = await createDBConnection();
  //usersテーブルのデータを全て削除
  connection.query(`truncate users`);
});

//全部のテストに共通の後処理 
afterEach(async () => {
  //usersテーブルのデータを全て削除
  connection.query(`truncate users`);
  //DB接続終了
  await connection.end();
});

describe("LoginApi", () => {
  describe("login", () => {
    it("case success should return token and 200 status", async () => {
      //準備
      const email = "mori@gmail.com";
      const password = "abcd1234";

      // パスワードのハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = { email, password: hashedPassword };
      const sql = 'insert into users set ?';
      const [result] = await connection.query<ResultSetHeader>(sql, user);
      const userId = result.insertId;

      //実行
      const response = await axios.post("/login", { email, password });

      //検証
      expect(response.status).toBe(200);

      const token = response.data.token;
      const decodeToken = jwt.verify(token, JWT_SECRET_KEY as string) as { id: number, jat: number, exp: number };
      expect(userId).toBe(decodeToken.id);

    });
    it("case not exsit params email or password should return error message and 400 status", async () => {
      //実行
      const response = await axios.post("/login", {});

      //検証
      expect(response.status).toBe(400);
      expect(response.data.error).toBe("メールアドレスとパスワードが必要です。");
    });

    it("case not exsit db email should return error message and 401 status", async () => {
      //実行
      const email = "mori@gmail.com";
      const password = "abcd1234";
      const response = await axios.post("/login", { email, password });

      //検証
      expect(response.status).toBe(401);
      expect(response.data.error).toBe("メールアドレスまたはパスワードが違います。");
    });

    it("case miss match password should return error message and 401 status", async () => {
      //準備
      const email = "mori@gmail.com";
      const password = "abcd1234";

      // パスワードのハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = { email, password: hashedPassword };
      const sql = 'insert into users set ?';
      await connection.query<ResultSetHeader>(sql, user);

      //実行
      const missMatchPassword = "hogehoge";
      const response = await axios.post("/login", { email, password: missMatchPassword });

      //検証
      expect(response.status).toBe(401);
      expect(response.data.error).toBe("メールアドレスまたはパスワードが違います。");
    });
  });
});
