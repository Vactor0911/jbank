import { dbPool } from "../config/db";
import { NotFoundError } from "../errors/CustomErrors";
import AccountModel from "../models/account.model";
import TransactionModel from "../models/transaction.model";

interface FormattedTransaction {
  uuid: string;
  sender: {
    uuid: string;
    name: string;
    accountNumber: string;
    currency: string;
    balance: string;
  };
  receiver: {
    uuid: string;
    name: string;
    accountNumber: string;
    currency: string;
    balance: string;
  };
  exchageRate: string;
  charge: string;
  type: string;
  statusCode: string;
  createdAt: string;
  updatedAt: string;
}

class TransactionService {
  /**
   * 거래 내역 uuid로 거래 내역 조회
   * @param transactionUuid 거래 내역 uuid
   * @returns 거래 내역 정보
   */
  static async findTransaction(
    transactionUuid: string
  ): Promise<FormattedTransaction> {
    // 거래 내역 조회
    const transaction = await TransactionModel.findByUuid(
      transactionUuid,
      dbPool
    );
    if (!transaction) {
      throw new NotFoundError("거레 내역을 찾을 수 없습니다.");
    }

    // 거래 내역 포맷팅
    const formattedTransaction = this.formatTransaction(transaction);

    // 포맷팅된 거래 내역 반환
    return formattedTransaction;
  }

  /**
   * 계좌번호로 거래 내역 조회
   * @param accountNumber 계좌번호
   * @returns 거래 내역 정보
   */
  static async getAccountTransactions(accountNumber: string) {
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

    // 거래 내역 포맷팅
    const formattedTransactions = transactions.map((transaction: any) =>
      this.formatTransaction(transaction)
    );

    // 거래 내역 반환
    return formattedTransactions;
  }

  /**
   * 거래 내역 포맷팅
   * @param transaction 거래 내역 데이터
   * @returns 포맷팅된 거래 내역
   */
  private static formatTransaction(transaction: any): FormattedTransaction {
    return {
      uuid: transaction.transaction_uuid,
      sender: {
        uuid: transaction.sender_uuid,
        name: transaction.sender_name,
        accountNumber: transaction.sender_account_number,
        currency: transaction.sender_currency,
        balance: transaction.sender_balance,
      },
      receiver: {
        uuid: transaction.receiver_uuid,
        name: transaction.receiver_name,
        accountNumber: transaction.receiver_account_number,
        currency: transaction.receiver_currency,
        balance: transaction.receiver_balance,
      },
      exchageRate: transaction.exchange_rate,
      charge: transaction.charge,
      type: transaction.type,
      statusCode: transaction.status_code,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    };
  }
}

export default TransactionService;
