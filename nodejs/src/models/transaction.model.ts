import { Pool, PoolConnection } from "mariadb/*";

class TransactionModel {
  /**
   * 거래 내역 id로 거래 내역 조회
   * @param transactionId 거래 내역 id
   * @param connection 데이터베이스 연결 객체
   * @returns 거래 내역 정보
   */
  static async findById(
    transactionId: string,
    connection: PoolConnection | Pool
  ) {
    const [transaction] = await connection.execute(
      `
        SELECT *
        FROM transaction
        WHERE transaction_id = ?
      `,
      [transactionId]
    );

    return transaction;
  }

  /**
   * 거래 내역 uuid로 거래 내역 조회
   * @param transactionUuid 거래 내역 uuid
   * @param connection 데이터베이스 연결 객체
   * @returns 거래 내역 정보
   */
  static async findByUuid(
    transactionUuid: string,
    connection: PoolConnection | Pool
  ) {
    const [transaction] = await connection.execute(
      `
        SELECT *
        FROM transaction
        WHERE transaction_uuid = ?
      `,
      [transactionUuid]
    );

    return transaction;
  }

  /**
   * 거래 내역 생성
   * @param transactionUuid 거래 내역 uuid
   * @param senderAccountId 송금자 계좌 id
   * @param receiverAccountId 수취자 계좌 id
   * @param senderCurrencyId 송금자 통화 id
   * @param receiverCurrencyId 수취자 통화 id
   * @param exchangeRate 환율
   * @param charge 거래 수수료
   * @param sendBalance 송금액
   * @param receiveBalance 수취액
   * @param type 거래 유형
   * @param statusCode 거래 상태 코드
   * @param apikeyId 거래 중개 API 키 id
   * @param connection 데이터베이스 연결 객체
   * @returns 생성 결과
   */
  static async create(
    transactionUuid: string,
    senderAccountId: string,
    receiverAccountId: string,
    senderCurrencyId: string,
    receiverCurrencyId: string,
    exchangeRate: string,
    charge: number,
    sendBalance: number,
    receiveBalance: number,
    type: "transfer" | "exchange",
    statusCode: string,
    apikeyId: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        INSERT INTO transaction
            (transaction_uuid, sender_account_id, receiver_account_id, sender_currency_id,
            receiver_currency_id, exchange_rate, charge, send_balance, receive_balance,
            type, status_code, apikey_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        transactionUuid,
        senderAccountId,
        receiverAccountId,
        senderCurrencyId,
        receiverCurrencyId,
        exchangeRate,
        charge,
        sendBalance,
        receiveBalance,
        type,
        statusCode,
        apikeyId,
      ]
    );

    return result;
  }

  // TODO: 거래 내역 조회 SQL문 수정
  /**
   * 계좌번호로 거래 내역 조회
   * @param accountNumber 계좌번호
   * @param connection 데이터베이스 연결 객체
   */
  static async findTransactionsByAccountNumber(
    accountNumber: string,
    connection: PoolConnection | Pool
  ) {
    const transactions = await connection.execute(
      `
        SELECT t.*, a.*
        FROM transaction t
        JOIN account a ON t.sender_account_id = a.account_id OR t.receiver_account_id = a.account_id
        WHERE a.account_number = ?
        ORDER BY t.created_at DESC
      `,
      [accountNumber]
    );

    return transactions;
  }

  /**
   * 거래 내역 정보 포맷팅
   * @param transaction 거래 내역 데이터
   * @returns 포맷팅된 거래 내역 정보
   */
  private static formatTransaction(transaction: any) {
    return {
      transactionUuid: transaction.transaction_uuid,
    };
  }
}

export default TransactionModel;
