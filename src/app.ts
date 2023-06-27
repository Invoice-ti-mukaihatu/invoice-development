// このファイルは、アプリケーションのエントリーポイント（始めの部分）です。
// ここからアプリケーションを起動します。
import express from "express";
import cors from "cors";
import mysql2, { ResultSetHeader, RowDataPacket } from "mysql2";

const app: express.Express = express();
app.disable('x-powered-by');
app.use(cors()).use(express.json());

// サーバ起動
// アプリケーションを開始し、ポート3000で待機します。
app.listen(3000, () => {
  // サーバが正常に開始したことをログに記録します。
  console.log("Start on port 3000.");
});

const connection = mysql2.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'pass',
  database: 'invoice_db',
});

  connection.connect((err) => {
    // データベースに接続できたらコンソールにconnected mysqlと表示
    if (err) throw err;
    console.log("connected mysql");
  });

// GETテスト
// Expressのappインスタンスに対するルーティング定義を行っています。
// この例では、GETメソッドで/testにアクセスしたときに、"hello"という文字列を返すように定義しています。
app.get("/test", (req: express.Request, res: express.Response) => {
  res.send("hello");
});

// usersのレコードをすべてを取得する
app.get("/api/users", (req, res) => {
  const sql = 'select * from users';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// usersのレコードを1件取得する
app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const sql = 'select * from users where ?';
  connection.query(sql, { id: id }, (err, results: RowDataPacket[]) => {
    console.log(results)
    if (err) throw err;
    res.json(results[0]);
  });
});

// usersのレコードを1件作成する
app.post("/api/users", (req, res) => {
  const user = req.body;
  const sql = 'insert into users set ?';
  connection.query(sql, user, (err, result: ResultSetHeader) => {
    if (err) throw err;
    // console.log(result)
    res.status(201).json(result.insertId);
  });
});

// usersのレコードを1件更新する
app.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const sql = 'update users set ? where ?';
  connection.query(sql, [user, { id: id }], (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// usersのレコードを1件削除する
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const sql = 'delete from users where ?';
  connection.query(sql, { id: id }, (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});