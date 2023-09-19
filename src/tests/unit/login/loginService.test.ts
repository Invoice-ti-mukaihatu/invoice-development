import { User } from "../../../models/users";
import { ILoginRepository } from "../../../repositories/login/interface";
import jwt from "jsonwebtoken";
import { LoginService } from "../../../services/login/loginService";
import * as dotenv from 'dotenv';
import bcrypt from "bcrypt";

dotenv.config();
const { JWT_SECRET_KEY } = process.env;

//テスト用のリポジトリ作成関数
function createMockRepository(): ILoginRepository {
  const mockRepository: ILoginRepository = {
    authenticate: jest.fn((email: string, password: string): Promise<number | Error> => {
      throw new Error("Function not implemented.");
    }),
    getUserByEmail: jest.fn((email: string): Promise<User | null> => {
      throw new Error("Function not implemented.");
    })
  };

  return mockRepository;
}

describe("LoginService", () => {
  describe("login", () => {
    //正常系テスト
    it("should return token", async () => {
      // テスト用のリポジトリを生成
      const mockRepository = createMockRepository();
      const userId = 1;

      // テスト用にただ値を返すだけのauthenticateメソッドをリポジトリに実装
      mockRepository.authenticate = jest.fn((email: string, password: string) => new Promise<number | Error>((resolve) => resolve(userId)));

      // テスト対象のServiceを生成
      // 実行
      const service = new LoginService(mockRepository);
      const result = await service.login("test@gmail.com", "pass");

      // エラー型かどうかチェック
      if (result instanceof Error) {
        // エラーが起きていたらテスト失敗
        throw new Error("Test failed because an error has occurred.");
      }

      const tokenPayload = { id: userId };
      const tokenOptions = { expiresIn: "30m" };
      const token = jwt.sign(tokenPayload, JWT_SECRET_KEY as string, tokenOptions);

      expect(result).toBe(token);
    });

    //異常系テスト
    it("should return repository error", async () => {
      // エラー文を生成
      const errMsg = "mock error";
      // 期待するエラーを作成
      const mockResult: Error = new Error(errMsg);

      // テスト用のリポジトリを生成
      const mockRepository = createMockRepository();
      // テスト用にただ値を返すだけのfindAllメソッドをリポジトリに実装
      mockRepository.authenticate = jest.fn((email: string, password: string) => new Promise<number | Error>((resolve) => resolve(mockResult)));

      // 実行
      const service = new LoginService(mockRepository);
      const result = await service.login("test@gmail.com", "pass");

      if (!(result instanceof Error)) {
        // エラーじゃなかったらテスト失敗
        throw new Error("Test failed because no error occurred");
      }

      // エラーメッセージが一致することを検証
      expect(result.message).toBe(mockResult.message);
    });
  });

  describe("getUserByEmail", () => {
    // 正常系テスト
    it("should return user", async () => {
      // テストデータ準備
      const mockResult: User = {
        id: 1,
        name: "test",
        email: "test@gmail.com",
        password: "pass",
        address: "東京",
        username: "テスト"
      };

      // テスト用のリポジトリを生成
      const mockRepository = createMockRepository();
      // テスト用にただ値を返すだけのgetByIdメソッドをリポジトリに実装
      mockRepository.getUserByEmail = jest.fn((email: string) => new Promise<User | null>((resolve) => resolve(mockResult)));

      //実行
      const service = new LoginService(mockRepository);
      const result = await service.getUserByEmail(mockResult.email);

      //nullだった場合はテスト失敗
      if (result === null) {
        throw new Error("Test failed because no User occurred");
      }
      //取得できた値が準備したテストデータと一致するかどうか検証
      expect(result.id).toBe(mockResult.id);
      expect(result.name).toBe(mockResult.name);
      expect(result.email).toBe(mockResult.email);
      expect(result.password).toBe(mockResult.password);
    });

    it("should return null ", async () => {
      // テスト用のリポジトリを生成
      const mockRepository = createMockRepository();
      // テスト用にただ値を返すだけのgetUserByEmailメソッドをリポジトリに実装
      mockRepository.getUserByEmail = jest.fn((email: string) => new Promise<User | null>((resolve) => resolve(null)));

      //実行
      const service = new LoginService(mockRepository);
      const result = await service.getUserByEmail("hogehoge");

      //Userだった場合はテスト失敗
      // if (typeof result?.id === "number" && typeof result.name === "string" && typeof result.email === "string" && typeof result.password === "string") {
      //   throw new Error("Test failed because no error occurred");
      // }
      if (result !== null) {
        throw new Error("Test failed because no User occurred");
      }
      //取得できた値が準備したテストデータと一致するかどうか検証
      // expect(result).toBe(null);
      expect(result).toBeNull();
    });
  });

  describe("checkPassword", () => {
    // 正常系テスト
    it("should return true", async () => {
      const password = "abcd1234";

      // パスワードのハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // テスト用のリポジトリを生成
      const mockRepository = createMockRepository();

      //実行
      const service = new LoginService(mockRepository);
      const result = await service.checkPassword(password, hashedPassword);

      //取得できた値が準備したテストデータと一致するかどうか検証
      expect(result).toBeTruthy();
    });

    it("should return false", async () => {
      const password = "abcd1234";
      const missMatchPassword = "hogehoge";
      // テスト用のリポジトリを生成
      const mockRepository = createMockRepository();

      //実行
      const service = new LoginService(mockRepository);
      const result = await service.checkPassword(password, missMatchPassword);

      //取得できた値が準備したテストデータと一致するかどうか検証
      expect(result).toBeFalsy();
    });
  });
});