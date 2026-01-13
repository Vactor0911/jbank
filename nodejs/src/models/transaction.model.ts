import { Pool, PoolConnection } from "mariadb/*";

export class TransactionModel {
  uuid: string;
  senderAccountId: string;
  receiverAccountId: string;
  currencyId: string;
  amount: number;

  constructor(data: any) {
    this.uuid = data.uuid;
    this.senderAccountId = String(data.senderAccountId);
    this.receiverAccountId = String(data.receiverAccountId);
    this.currencyId = String(data.currencyId);
    this.amount = Number(data.amount);
  }

  /**
   * 송금 거래 생성
   * @param transactionUuid 거래 uuid
   * @param senderAccountId 송금 계좌 id
   * @param receiverAccountId 수취 계좌 id
   * @param amount 송금 금액
   * @param connection MariaDB 연결 객체
   * @returns 거래 모델
   */
  static async createTransfer(
    transactionUuid: string,
    senderAccountId: string,
    receiverAccountId: string,
    amount: number,
    connection: PoolConnection | Pool
  ) {
    await connection.execute(
      `
        INSERT INTO transaction
            (transaction_uuid, sender_account_id, receiver_account_id, currency_id, amount)
            VALUES (?, ?, ?, 1, ?)
      `,
      [transactionUuid, senderAccountId, receiverAccountId, amount]
    );
    return this.formatTransaction({
      transaction_uuid: transactionUuid,
      sender_account_id: senderAccountId,
      receiver_account_id: receiverAccountId,
      currency_id: 1,
      amount: amount,
    });
  }

  /**
   * 거래 데이터 포맷팅
   * @param data 거래 데이터
   * @returns 거래 모델
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
}
