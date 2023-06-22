// このファイルは、アプリケーションのエントリーポイント（始めの部分）です。
// ここからアプリケーションを起動します。
import express from "express";
const app: express.Express = express();

// サーバ起動
// アプリケーションを開始し、ポート3000で待機します。
app.listen(3000, () => {
  // サーバが正常に開始したことをログに記録します。
  console.log("Start on port 3000.");
});

// GETテスト
// Expressのappインスタンスに対するルーティング定義を行っています。
// この例では、GETメソッドで/testにアクセスしたときに、"hello"という文字列を返すように定義しています。
app.get("/test", (req: express.Request, res: express.Response) => {
  res.send("hello");
});