import { Pool, PoolConnection } from "mysql2/promise";

export class TransactionModel {
  uuid: string;
  senderAccountId: string;
  senderAccountHolderUuid?: string;
  senderAccountHolderName?: string;
  senderAccountNumber?: string;
  receiverAccountId: string;
  receiverAccountHolderUuid?: string;
  receiverAccountHolderName?: string;
  receiverAccountNumber?: string;
  currencyId: string;
  currencyCode?: string;
  amount: number;
  senderCurrentBalance: string;
  receiverCurrentBalance: string;
  createdAt: Date;

  constructor(data: any) {
    this.uuid = data.uuid;
    this.senderAccountId = String(data.senderAccountId);
    this.senderAccountHolderUuid = data.senderAccountHolderUuid || undefined;
    this.senderAccountHolderName = data.senderAccountHolderName || undefined;
    this.senderAccountNumber = data.senderAccountNumber || undefined;
    this.receiverAccountId = String(data.receiverAccountId);
    this.receiverAccountHolderUuid =
      data.receiverAccountHolderUuid || undefined;
    this.receiverAccountHolderName =
      data.receiverAccountHolderName || undefined;
    this.receiverAccountNumber = data.receiverAccountNumber || undefined;
    this.currencyId = String(data.currencyId);
    this.currencyCode = data.currencyCode || undefined;
    this.amount = Number(data.amount);
    this.senderCurrentBalance = String(data.senderCurrentBalance);
    this.receiverCurrentBalance = String(data.receiverCurrentBalance);
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
          c.code AS currency_code,
          sender_user.user_uuid AS sender_account_holder_uuid,
          sender_user.steam_name AS sender_account_holder_name,
          sender_acc.account_number AS sender_account_number,
          receiver_user.user_uuid AS receiver_account_holder_uuid,
          receiver_user.steam_name AS receiver_account_holder_name,
          receiver_acc.account_number AS receiver_account_number
        FROM transaction t
        JOIN currency c ON t.currency_id = c.currency_id
        JOIN account sender_acc ON t.sender_account_id = sender_acc.account_id
        JOIN account receiver_acc ON t.receiver_account_id = receiver_acc.account_id
        JOIN user sender_user ON sender_acc.user_id = sender_user.user_id
        JOIN user receiver_user ON receiver_acc.user_id = receiver_user.user_id
        WHERE t.transaction_uuid = ?
      `,
      [transactionUuid]
    );

    if (!(transaction as any[])[0]) {
      return null;
    }

    const formattedTransaction = this.formatTransactionDetail(
      (transaction as any[])[0]
    );
    return formattedTransaction;
  }

  /**
   * 계좌 id로 거래 내역 조회
   * @param accountId 계좌 id
   * @param connection MariaDB 연결 객체
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   * @returns 거래 내역 모델 배열
   */
  static async findByAccountId(
    accountId: string,
    page: number,
    limit: number,
    connection: PoolConnection | Pool
  ) {
    const [transactions] = await connection.execute(
      `
        SELECT t.*,
          c.code AS currency_code,
          sender_user.user_uuid AS sender_account_holder_uuid,
          sender_user.steam_name AS sender_account_holder_name,
          sender_acc.account_number AS sender_account_number,
          receiver_user.user_uuid AS receiver_account_holder_uuid,
          receiver_user.steam_name AS receiver_account_holder_name,
          receiver_acc.account_number AS receiver_account_number
        FROM transaction t
        JOIN currency c ON t.currency_id = c.currency_id
        JOIN account sender_acc ON t.sender_account_id = sender_acc.account_id
        JOIN account receiver_acc ON t.receiver_account_id = receiver_acc.account_id
        JOIN user sender_user ON sender_acc.user_id = sender_user.user_id
        JOIN user receiver_user ON receiver_acc.user_id = receiver_user.user_id
        WHERE t.sender_account_id = ? OR t.receiver_account_id = ?
        ORDER BY t.transaction_id DESC
        LIMIT ? OFFSET ?
      `,
      [accountId, accountId, limit, (page - 1) * limit]
    );

    if (!transactions) {
      return [];
    }

    return (transactions as any[]).map(this.formatTransactionDetail);
  }

  /**
   * 송금 거래 생성
   * @param transactionUuid 거래 uuid
   * @param senderAccountId 송금 계좌 id
   * @param receiverAccountId 수취 계좌 id
   * @param amount 송금 금액
   * @param senderCurrentBalance 송금자 현재 잔액
   * @param receiverCurrentBalance 수취자 현재 잔액
   * @param connection MariaDB 연결 객체
   * @returns 거래 내역 모델
   */
  static async createTransfer(
    transactionUuid: string,
    senderAccountId: string,
    receiverAccountId: string,
    amount: number,
    senderCurrentBalance: string,
    receiverCurrentBalance: string,
    connection: PoolConnection | Pool
  ) {
    await connection.execute(
      `
        INSERT INTO transaction
            (transaction_uuid, sender_account_id, receiver_account_id, currency_id, amount,
            sender_current_balance, receiver_current_balance)
            VALUES (?, ?, ?, 1, ?, ?, ?)
      `,
      [
        transactionUuid,
        senderAccountId,
        receiverAccountId,
        amount,
        senderCurrentBalance,
        receiverCurrentBalance,
      ]
    );

    return this.formatTransaction({
      transaction_uuid: transactionUuid,
      sender_account_id: senderAccountId,
      receiver_account_id: receiverAccountId,
      currency_id: 1,
      amount: amount,
      current_balance: senderCurrentBalance,
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
      senderAccountHolderUuid: data.sender_account_holder_uuid,
      senderAccountHolderName: data.sender_account_holder_name,
      senderAccountNumber: data.sender_account_number,
      receiverAccountId: data.receiver_account_id,
      receiverAccountHolderUuid: data.receiver_account_holder_uuid,
      receiverAccountHolderName: data.receiver_account_holder_name,
      receiverAccountNumber: data.receiver_account_number,
      currencyId: data.currency_id,
      currencyCode: data.currency_code,
      amount: data.amount,
      senderCurrentBalance: data.sender_current_balance,
      receiverCurrentBalance: data.receiver_current_balance,
      createdAt: data.created_at,
    });
  }
}
