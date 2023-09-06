export interface IUserService {
  // ログインするさ時のメソッド、正常時トークンを返す。エラーが発生した場合エラーを返す
  checkForDuplicate(userId: number, email: string): Promise<boolean | null | Error>;
  updateUser(
    userId: number,
    username: string,
    email: string,
    name: string,
    address: string
  ): Promise<void | Error>;
}
