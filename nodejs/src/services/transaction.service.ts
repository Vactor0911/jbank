import { dbPool } from "../config/db";
import { NotFoundError } from "../errors/CustomErrors";
import AccountModel from "../models/account.model";
import TransactionModel from "../models/transaction.model";

class TransactionService {
  /**
   * 계좌번호로 거래 내역 조회
   * @param accountNumber 계좌번호
   * @returns 거래 내역 정보
   */
  static async getTransactions(accountNumber: string) {
    // 계좌 번호로 계좌 조회
    const account = await AccountModel.findByAccountNumber(
      accountNumber,
      dbPool
    );
    if (!account) {
      throw new NotFoundError("계좌를 찾을 수 없습니다.");
    }

    // 거래 내역 조회
    const transactions = await TransactionModel.findTransactionsByAccountNumber(
      accountNumber,
      dbPool
    );

    // 거래 내역 반환
    return transactions;
  }
}

export default TransactionService;
