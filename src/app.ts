import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import mysql2, { Connection, ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

async function main() {
  //.envファイルの読み込み
  dotenv.config();
  const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASS,
    MYSQL_DB,
    JWT_SECRET_KEY,
    FRONT_BASE_URL,
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

  app.listen(3000, () => {
    // サーバが正常に開始したことをログに記録します。
    console.log("Start on port 3000.");
  });
  // mysqlに接続,mysql2のモジュールを使ってデータベース情報を変数connectionに入れる
  const connection: Connection = mysql2.createConnection({
    host: MYSQL_HOST as string,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
  });

  connection.connect((err) => {
    // // 接続できなかった場合エラーを投げる
    if (err) throw err;
    // データベースに接続できたらコンソールにconnected mysqlと表示
    console.log("connected mysql");
  });

  app.use(bodyParser.json());
  app.use(cookieParser());

  // ユーザー新規登録
  app.post("/users", (req, res) => {
    // リクエストボディからメールアドレスとパスワードを取得
    const { email, password } = req.body;

    const saltRounds = 10; // ハッシュ化のコストを指定、コストの値が高いほどハッシュ化が遅くなり、セキュリティが向上するっぽい
    // パスワードのハッシュ化
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error while hashing password:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // ハッシュ化されたパスワードとメールをuser変数へ代入
      const user = { email, password: hashedPassword };

      // user情報をDBに挿入するSQLクエリ文
      const sql = "insert into users set ?";
      connection.query(sql, user, (err, result: ResultSetHeader) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            // ユニーク制約違反 (重複エラー)
            // console.error("Duplicate entry for email:", email);
            return res.status(400).json({ error: "このメールアドレスは既に登録されています。" });
          } else {
            // 上記以外のエラーの場合
            // console.error("Error while inserting user:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
        }

        res.status(201).json(result.insertId);
      });
    });
  });

  //ログイン認証
  app.post("/login", (req, res) => {
    // リクエストボディからメールアドレスとパスワードを取得
    const { email, password } = req.body;

    // リクエストされたメールアドレスとパスワードが入力されているかチェック
    if (!email || !password) {
      return res.status(400).json({ error: "メールアドレスとパスワードが必要です。" });
    }

    // データベースからメールアドレス情報を取得
    const sql = "select * from users where email = ?";
    connection.query(sql, [email], async (err, results: RowDataPacket[]) => {
      // エラーが発生した場合は、エラーを投げています。
      if (err) throw err;

      // データベースに該当のメールアドレスがが存在しない場合のエラーハンドリング
      if (results.length === 0) {
        return res.status(401).json({ error: "メールアドレスまたはパスワードが違います。" });
      }
      // ユーザー情報を取得
      const user = results[0];
      // パスワードの一致チェック
      const passwordMatch = await bcrypt.compare(password, user.password);

      // パスワードが一致しない場合のエラーハンドリング
      if (!passwordMatch) {
        return res.status(401).json({ error: "メールアドレスまたはパスワードが違います。" });
      }

      // ユーザーが認証成功した場合、JWTトークンを生成して返す
      const tokenPayload = { id: user.id }; // ユーザーIDをトークンに含める
      const tokenOptions = { expiresIn: "30m" }; // 30分の有効期限を設定
      const token = jwt.sign(tokenPayload, JWT_SECRET_KEY as string, tokenOptions);
      // トークンをクッキーにセット
      res.cookie("token", token, {
        maxAge: 30 * 60 * 1000, // 30分の有効期限
        httpOnly: true, // JavaScriptからクッキーにアクセス不可
        secure: true, // セキュアな通信でのみ送信
        sameSite: "strict", // SameSite属性を設定
      });

      // トークンを含むレスポンスを返す
      return res.status(200).json({ token });
    });
  });

  // usersのレコードをすべてを取得する（GET）
  // app.getメソッドの第1引数には、ルーティングのパスを指定します。
  // この例では、/usersというパスに対するルーティングを定義しています。
  // app.getメソッドの第2引数には、ルーティングに対する処理を定義します。
  // この例では、データベースからusersテーブルのレコードをすべて取得して、
  // JSON形式でレスポンスを返しています。
  app.get("/users", (req, res) => {
    // usersのレコードをすべて取得する
    const sql = "select * from users";

    // connection.queryメソッドを呼び出して、SQL文を実行しています。
    connection.query(sql, (err, result) => {
      // エラーが発生した場合は、エラーを投げています。
      if (err) throw err;

      // レスポンスを返しています。
      res.json(result);
    });
  });

  // usersのレコードを1件取得する（GET）
  // app.getメソッドの第1引数には、ルーティングのパスを指定します。
  // この例では、/users/:idというパスに対するルーティングを定義しています。
  // :idというのは、パスの一部が可変であることを表しています。
  // この例では、/users/1や/api/users/2などのように、
  // /users/の後に数字が続くようなパスに対するルーティングを定義しています。
  // app.getメソッドの第2引数には、ルーティングに対する処理を定義します。
  // この例では、データベースからusersテーブルのレコードを1件取得して、
  // JSON形式でレスポンスを返しています。
  app.get("/users/:id", (req, res) => {
    // パスの:idの部分を取得する
    const id = req.params.id;

    // usersのレコードを1件取得する
    const sql = "select * from users where ?";

    // connection.queryメソッドを呼び出して、SQL文を実行しています。
    connection.query(sql, { id: id }, (err, results: RowDataPacket[]) => {
      // データベースから取得したレコードが配列でresultsに渡されます。
      console.log(results);

      // エラーが発生した場合は、エラーを投げています。
      if (err) throw err;

      // レスポンスを返しています。
      res.json(results[0]);
    });
  });

  // usersのレコードを1件作成する（POST）
  // app.postメソッドの第1引数には、ルーティングのパスを指定します。
  // この例では、/usersというパスに対するルーティングを定義しています。
  // app.postメソッドの第2引数には、ルーティングに対する処理を定義します。
  // この例では、リクエストボディに含まれるデータをusersテーブルに挿入しています。
  // また、レスポンスとして、挿入したレコードのIDを返しています。
  // app.post("/users", (req, res) => {

  //   // リクエストボディに含まれるデータを取得する
  //   const user = req.body;

  //   // usersのレコードを1件作成する
  //   const sql = 'insert into users set ?';

  //   // connection.queryメソッドを呼び出して、SQL文を実行しています。
  //   connection.query(sql, user, (err, result: ResultSetHeader) => {

  //     // エラーが発生した場合は、エラーを投げています。
  //     if (err) throw err;

  //     // console.log(result)
  //     res.status(201).json(result.insertId);
  //   });
  // });

  // usersのレコードを1件更新する
  // app.putメソッドの第1引数には、ルーティングのパスを指定します。
  // この例では、/users/:idというパスに対するルーティングを定義しています。
  // :idというのは、パスの一部が可変であることを表しています。
  // この例では、/users/1や/api/users/2などのように、
  // /users/の後に数字が続くようなパスに対するルーティングを定義しています。
  // app.putメソッドの第2引数には、ルーティングに対する処理を定義します。
  // この例では、リクエストボディに含まれるデータをusersテーブルに更新しています。
  // また、レスポンスとして、更新したレコードのIDを返しています。
  app.put("/users/:id", (req, res) => {
    // パスの:idの部分を取得する
    const id = req.params.id;

    // リクエストボディに含まれるデータを取得する
    const user = req.body;

    // usersのレコードを1件更新する
    const sql = "update users set ? where ?";

    // connection.queryメソッドを呼び出して、SQL文を実行しています。
    connection.query(sql, [user, { id: id }], (err) => {
      // エラーが発生した場合は、エラーを投げています。
      if (err) throw err;

      // レスポンスを返しています。
      res.status(200).send();
    });
  });

  // usersのレコードを1件削除する
  // app.deleteメソッドの第1引数には、ルーティングのパスを指定します。
  // この例では、/users/:idというパスに対するルーティングを定義しています。
  // :idというのは、パスの一部が可変であることを表しています。
  // この例では、/users/1や/api/users/2などのように、
  // /users/の後に数字が続くようなパスに対するルーティングを定義しています。
  // app.deleteメソッドの第2引数には、ルーティングに対する処理を定義します。
  // この例では、usersテーブルからレコードを1件削除しています。
  // また、レスポンスとして、ステータスコード200を返しています。
  app.delete("/users/:id", (req, res) => {
    // パスの:idの部分を取得する
    const id = req.params.id;

    // usersのレコードを1件削除する
    const sql = "delete from users where ?";

    // connection.queryメソッドを呼び出して、SQL文を実行しています。
    connection.query(sql, { id: id }, (err) => {
      // エラーが発生した場合は、エラーを投げています。
      if (err) throw err;

      // レスポンスを返しています。
      res.status(200).send();
    });
  });
}

main();
