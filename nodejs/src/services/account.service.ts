import { mariaDB } from "../config/mariadb";
import { NotFoundError } from "../errors/CustomErrors";
import AccountModel from "../models/account.model";
import { UserModel } from "../models/user.model";

class AccountService {
  /**
   * 사용자 계좌 목록 조회
   * @param userId 사용자 id
   * @returns 계좌 목록
   */
  static async getAccounts(userId: string) {
    // 사용자 조회
    const user = await UserModel.findById(userId, mariaDB);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 계좌 목록 조회
    const accounts = await AccountModel.findByUserId(userId, mariaDB);

    return accounts;
  }
}

export default AccountService;
