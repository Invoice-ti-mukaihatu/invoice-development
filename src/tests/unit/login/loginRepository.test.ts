import { Connection } from "mysql2/promise";
import { LoginRepository } from "../../../repositories/login/loginRepository";
import { createDBConnection } from "../../utils/Database/database";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";


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

describe("LoginRepository", () => {
  describe("getUserByEmail", () => {
    it("shoud return user", async () => {

      //準備
      const email = "mori@gmail.com";
      const password = "abcd1234";

      // パスワードのハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = { email, password: hashedPassword };
      const sql = 'insert into users set ?';
      const [rows] = await connection.query<ResultSetHeader>(sql, [user]);

      const repository = new LoginRepository(connection);
      const result = await repository.getUserByEmail(email);

      expect(rows.insertId).toBe(result?.id);
      expect(email).toBe(result?.email);
      expect(hashedPassword).toBe(result?.password);
    });

    it("case miss match email shoud return null", async () => {

      //準備
      const email = "moriTest@gmail.com";

      const repository = new LoginRepository(connection);
      const result = await repository.getUserByEmail(email);

      expect(null).toBe(result);
    });
  });

  describe("authenticate", () => {
    //正常系
    it("case match password shoud return user.id", async () => {
      //準備
      const email = "mori@gmail.com";
      const password = "abcd1234";

      // パスワードのハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = { email, password: hashedPassword };
      const sql = 'insert into users set ?';
      const [rows] = await connection.query<ResultSetHeader>(sql, [user]);

      //実行
      const repository = new LoginRepository(connection);
      const result = await repository.authenticate(email, password);

      if (result instanceof Error) {
        throw new Error("Test failed because no error occurred");
      }
      expect(rows.insertId).toBe(result);
    });

    //異常系
    it("case miss match email shoud return error", async () => {
      //準備
      const email = "moriTest@gmail.com";
      const password = "abcd1234";


      //実行
      const repository = new LoginRepository(connection);
      const result = await repository.authenticate(email, password);

      if (typeof result === "number") {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof Error).toBeTruthy();
      expect(result.message).toBe("User not found");
    });

    //異常系
    it("case miss match password shoud return error", async () => {

      //準備
      const email = "mori@gmail.com";
      const password = "abcd1234";

      // パスワードのハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = { email, password: hashedPassword };
      const sql = 'insert into users set ?';
      await connection.query<ResultSetHeader>(sql, [user]);

      const missMatchPassword = "hogehoge";
      const repository = new LoginRepository(connection);
      const result = await repository.authenticate(email, missMatchPassword);

      if (typeof result === "number") {
        throw new Error("Test failed because type number");
      }

      expect(result instanceof Error).toBeTruthy();
      expect(result.message).toBe("Authentication failed");
    });
  });
});
