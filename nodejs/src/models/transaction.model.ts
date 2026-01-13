import { Pool, PoolConnection } from "mariadb/*";

export class TransactionModel {
  uuid: string;
  senderAccountId: string;
  receiverAccountId: string;
  currencyId: string;
  currencyCode?: string;
  amount: number;
  currentBalance: string;
  createdAt: Date;

  constructor(data: any) {
    this.uuid = data.uuid;
    this.senderAccountId = String(data.senderAccountId);
    this.receiverAccountId = String(data.receiverAccountId);
    this.currencyId = String(data.currencyId);
    this.currencyCode = data.currencyCode || undefined;
    this.amount = Number(data.amount);
    this.currentBalance = String(data.currentBalance);
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * 거래 내역 uuid로 거래 내역 조회
   * @param transactionUuid 거래 내역 uuid
   * @param connection MariaDB 연결 객체
   * @returns 거래 내역 모델
   */
  static async findByUuid(
    transactionUuid: string,
    connection: PoolConnection | Pool
  ) {
    const [transaction] = await connection.execute(
      `
        SELECT t.*,
          c.code AS currency_code
        FROM transaction t
        JOIN currency c ON t.currency_id = c.currency_id
        WHERE t.transaction_uuid = ?
      `,
      [transactionUuid]
    );
    return this.formatTransactionDetail(transaction);
  }

  /**
   * 송금 거래 생성
   * @param transactionUuid 거래 uuid
   * @param senderAccountId 송금 계좌 id
   * @param receiverAccountId 수취 계좌 id
   * @param amount 송금 금액
   * @param connection MariaDB 연결 객체
   * @returns 거래 내역 모델
   */
  static async createTransfer(
    transactionUuid: string,
    senderAccountId: string,
    receiverAccountId: string,
    amount: number,
    currentBalance: string,
    connection: PoolConnection | Pool
  ) {
    await connection.execute(
      `
        INSERT INTO transaction
            (transaction_uuid, sender_account_id, receiver_account_id, currency_id, amount, current_balance)
            VALUES (?, ?, ?, 1, ?, ?)
      `,
      [
        transactionUuid,
        senderAccountId,
        receiverAccountId,
        amount,
        currentBalance,
      ]
    );
    return this.formatTransaction({
      transaction_uuid: transactionUuid,
      sender_account_id: senderAccountId,
      receiver_account_id: receiverAccountId,
      currency_id: 1,
      amount: amount,
      current_balance: currentBalance,
    });
  }

  /**
   * 거래 내역 데이터 포맷팅
   * @param data 거래 내역 데이터
   * @returns 거래 내역 모델
   */
  private static formatTransaction(data: any) {
    if (!data) {
      return null;
    }

    return new TransactionModel({
      uuid: data.transaction_uuid,
      senderAccountId: data.sender_account_id,
      receiverAccountId: data.receiver_account_id,
      currencyId: data.currency_id,
      amount: data.amount,
    });
  }

  /**
   * 거래 내역 상세 데이터 포맷팅
   * @param data 거래 내역 상세 데이터
   * @returns 거래 내역 모델
   */
  private static formatTransactionDetail(data: any) {
    if (!data) {
      return null;
    }

    return new TransactionModel({
      uuid: data.transaction_uuid,
      senderAccountId: data.sender_account_id,
      receiverAccountId: data.receiver_account_id,
      currencyId: data.currency_id,
      currencyCode: data.currency_code,
      amount: data.amount,
      currentBalance: data.current_balance,
      createdAt: data.created_at,
    });
  }
}
