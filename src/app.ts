// このファイルは、アプリケーションのエントリーポイント（始めの部分）です。
// ここからアプリケーションを起動します。

// 必要なモジュールを読み込む
// 具体的には、expressモジュール、corsモジュール、mysql2モジュールを読み込んでいます。
// これらのモジュールは、npm installコマンドでインストールしてください。

// expressモジュールを読み込み、expressという名前の変数に格納しています。
import express from "express";

// corsモジュールを読み込み、corsという名前の変数に格納しています。
import cors from "cors";

// mysql2モジュールを読み込み、mysql2という名前の変数に格納しています。
import mysql2, { ResultSetHeader, RowDataPacket } from "mysql2";

// アプリケーションを起動する
// 具体的には、expressモジュールのインスタンスを生成して、サーバを起動しています。
// このメソッドの引数には、接続に必要な情報を指定します。
// これらの情報は、MySQLサーバをインストールしたときに設定したものを指定してください。

// expressモジュールのインスタンスを生成して、appという名前の変数に格納しています。
const app: express.Express = express();

// エラーハンドリングを行う
// 具体的には、app.useメソッドを呼び出して、エラーハンドリングを行っています。
// このメソッドの引数には、エラーを処理するための関数を指定します。
// この関数の引数には、エラーオブジェクトが渡されます。
// この例では、エラーオブジェクトをコンソールに出力しています。

// ヘッダーの表示を消す
app.disable('x-powered-by');

// jsonの送信を許可
app.use(cors()).use(express.json());

// サーバを起動する
// 具体的には、app.listenメソッドを呼び出して、サーバを起動しています。
// このメソッドの引数には、ポート番号を指定します。
// この例では、ポート番号3000を指定しています。

// アプリケーションを開始し、ポート3000で待機します。
// 1. Dockerを立ち上げる docker-compose up -d（今回の開発の全体のファイル構成的にはmysqlディレクトリに移動してDockerコマンドを打つ）
// 2. ターミナルで、npm run devコマンドを実行し、URLに、http://localhost:3000/usersを指定してアクセスしてください。
// 3. ブラウザに、何かしらのデータが表示されれば、正常に動作しています。
// 4. npm run devを停止する時は、ターミナルでcontrol + cキーを押してください。
// 5. Dockerを停止する時は、ターミナルでcontrol + cキーを押し、docker-compose downを実行する
app.listen(3000, () => {
  // サーバが正常に開始したことをログに記録します。
  console.log("Start on port 3000.");
});

// データベースに接続する
// 具体的には、mysql2モジュールのcreateConnectionメソッドを呼び出して、データベースに接続しています。
// 接続に必要な情報は、ホスト名、ポート番号、ユーザー名、パスワード、データベース名です。
// これらの情報は、MySQLサーバをインストールしたときに設定したものを指定してください。

// データベースに接続
// 1. Dockerが立ち上がってるのを確認する
// 2. ターミナルでmysqlディレクトリに移動し、docker exec -it my-mysql mysql -uroot -ppassコマンドを打つ
// 3. mysqlの中に入れたら、show databases;コマンドを打ち、invoice_dbがあることを確認する
// 4. ない場合は、create database invoice_db;コマンドを打つ
// 5. あれば、成功！問題なし！、そして、DBバーを開き接続を試みる
// 6. mysqlから出る時は、exitコマンドを打つ

// ここがDBバーを使う時の必要な設定項目
const connection = mysql2.createConnection({

  // ホスト名
  host: 'localhost',

  // ポート番号
  port: 3306,

  // ユーザー名
  user: 'root',

  // パスワード
  password: 'pass',

  // データベース名
  database: 'invoice_db',
});

// データベースの接続を切断する
// 具体的には、connection.endメソッドを呼び出して、データベースの接続を切断しています。

// エラーが発生した場合の処理は、コールバック関数の引数errにエラーオブジェクトが渡されるので、
// それをthrowで投げています。
// これにより、エラーが発生した場合には、アプリケーションが停止するようになります。
// また、接続に成功した場合は、コンソールにconnected mysqlと表示しています。
connection.connect((err) => {

  // データベースに接続できたらコンソールにconnected mysqlと表示
  // // 接続できなかった場合エラーを投げる
  if (err) throw err;

  // データベースに接続できたらコンソールにconnected mysqlと表示
  console.log("connected mysql");
});

// ルーティングを定義する
// 具体的には、Expressのappインスタンスに対するルーティング定義を行っています。
// この例では、GETメソッドで/testにアクセスしたときに、"hello"という文字列を返すように定義しています。

// GETテスト
app.get("/test", (req, res) => {
  res.send("hello");
});

// usersのレコードをすべてを取得する（GET）
// app.getメソッドの第1引数には、ルーティングのパスを指定します。
// この例では、/usersというパスに対するルーティングを定義しています。
// app.getメソッドの第2引数には、ルーティングに対する処理を定義します。
// この例では、データベースからusersテーブルのレコードをすべて取得して、
// JSON形式でレスポンスを返しています。
app.get("/users", (req, res) => {

  // usersのレコードをすべて取得する
  const sql = 'select * from users';

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
  const sql = 'select * from users where ?';

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
app.post("/users", (req, res) => {

  // リクエストボディに含まれるデータを取得する
  const user = req.body;

  // usersのレコードを1件作成する
  const sql = 'insert into users set ?';

  // connection.queryメソッドを呼び出して、SQL文を実行しています。
  connection.query(sql, user, (err, result: ResultSetHeader) => {

    // エラーが発生した場合は、エラーを投げています。
    if (err) throw err;

    // console.log(result)
    res.status(201).json(result.insertId);
  });
});

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
  const sql = 'update users set ? where ?';

  // connection.queryメソッドを呼び出して、SQL文を実行しています。
  connection.query(sql, [user, { id: id }], (err, result) => {

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
  const sql = 'delete from users where ?';

  // connection.queryメソッドを呼び出して、SQL文を実行しています。
  connection.query(sql, { id: id }, (err, result) => {

    // エラーが発生した場合は、エラーを投げています。
    if (err) throw err;

    // レスポンスを返しています。
    res.status(200).send();
  });
});