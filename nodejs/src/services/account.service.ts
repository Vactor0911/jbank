import { dbPool } from "../config/db";
import { NotFoundError } from "../errors/CustomErrors";
import AccountModel from "../models/account.model";

class AccountService {
  /**
   * 계좌번호로 계좌 조회
   * @param accountNumber 계좌번호
   * @returns 계좌 정보
   */
  static async findAccountByAccountNumber(accountNumber: string) {
    // 계좌번호로 계좌 조회
    const account = await AccountModel.searchByAccountNumber(
      accountNumber,
      dbPool
    );
    if (!account) {
      throw new NotFoundError("계좌를 찾을 수 없습니다.");
    }

    // 계좌 정보 포맷팅
    console.log("Raw Account:", account);
    const formattedAccount = this.formatAccount(account);

    // 계좌 정보 반환
    console.log("Formatted Account:", formattedAccount);
    return formattedAccount;
  }

  /**
   * 계좌번호로 예금 조회
   * @param accountNumber 계좌번호
   * @returns 예금 정보
   */
  static async getAccountBalance(accountNumber: string) {
    // 계좌번호로 계좌 조회
    const account = await AccountModel.findByAccountNumber(
      accountNumber,
      dbPool
    );
    if (!account) {
      throw new NotFoundError("계좌를 찾을 수 없습니다.");
    }

    // 예금 정보 추출
    const balance = {
      jlc: String(account.jlc),
    };

    // 예금 정보 반환
    return balance;
  }

  /**
   * 계좌 정보 포맷팅
   * @param account 계좌 데이터
   * @returns 포맷팅된 계좌 정보
   */
  private static formatAccount(account: any) {
    return {
      uuid: account.account_uuid,
      ownerName: account.owner_name,
      ownerSteamId: account.owner_steam_id,
      accountNumber: account.account_number,
      status: account.status,
    };
  }
}

export default AccountService;
