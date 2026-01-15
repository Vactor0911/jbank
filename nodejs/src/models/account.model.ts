import { Pool, PoolConnection } from "mysql2/promise";

class AccountModel {
  id: string;
  uuid: string;
  userId: string;
  accountNumber: string;
  password: string;
  status: string;
  credit: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = String(data.id);
    this.uuid = data.uuid;
    this.userId = String(data.userId);
    this.accountNumber = data.accountNumber;
    this.password = data.password;
    this.status = data.status;
    this.credit = String(data.credit);
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * 계좌 id로 계좌 조회
   * @param accountId 계좌 id
   * @param connection MariaDB 연결 객체
   * @returns 계좌 모델
   */
  static async findById(accountId: string, connection: PoolConnection | Pool) {
    const [account] = await connection.execute(
      `
        SELECT *
        FROM account
        WHERE account_id = ?
      `,
      [accountId]
    );

    if (!(account as any[])[0]) {
      return null;
    }

    const formattedAccount = this.formatAccount((account as any[])[0]);
    return formattedAccount;
  }

  /**
   * 계좌 uuid로 계좌 조회
   * @param accountUuid 계좌 uuid
   * @param connection MariaDB 연결 객체
   * @returns 계좌 모델
   */
  static async findByUuid(
    accountUuid: string,
    connection: PoolConnection | Pool
  ) {
    const [account] = await connection.execute(
      `
        SELECT *
        FROM account
        WHERE account_uuid = ?
      `,
      [accountUuid]
    );

    if (!(account as any[])[0]) {
      return null;
    }

    const formattedAccount = this.formatAccount((account as any[])[0]);
    return formattedAccount;
  }

  /**
   * 사용자 id로 계좌 조회
   * @param userId 사용자 id
   * @param connection MariaDB 연결 객체
   * @returns 계좌 목록
   */
  static async findByUserId(userId: string, connection: PoolConnection | Pool) {
    const [accounts] = await connection.execute(
      `
        SELECT *
        FROM account
        WHERE user_id = ?
      `,
      [userId]
    );

    if (!accounts) {
      return [];
    }

    return (accounts as any[]).map((account: any) =>
      this.formatAccount(account)
    );
  }

  /**
   * 계좌번호로 계좌 조회
   * @param accountNumber 계좌 번호
   * @param connection MariaDB 연결 객체
   * @returns 계좌 모델
   */
  static async findByAccountNumber(
    accountNumber: string,
    connection: PoolConnection | Pool
  ) {
    const [account] = await connection.execute(
      `
        SELECT *
        FROM account
        WHERE account_number = ?
      `,
      [accountNumber]
    );

    if (!(account as any[])[0]) {
      return null;
    }

    const formattedAccount = this.formatAccount((account as any[])[0]);
    return formattedAccount;
  }

  /**
   * 계좌번호로 계좌 조회 (쓰기 잠금)
   * @param accountNumber 계좌 번호
   * @param connection MariaDB 연결 객체
   * @returns 계좌 모델
   */
  static async findByAccountNumberForUpdate(
    accountNumber: string,
    connection: PoolConnection | Pool
  ) {
    const [account] = await connection.execute(
      `
        SELECT *
        FROM account
        WHERE account_number = ?
        FOR UPDATE
      `,
      [accountNumber]
    );

    if (!(account as any[])[0]) {
      return null;
    }

    const formattedAccount = this.formatAccount((account as any[])[0]);
    return formattedAccount;
  }

  /**
   * 계좌 생성
   * @param accountUuid 계좌 uuid
   * @param userId 사용자 id
   * @param accountNumber 계좌 번호
   * @param password 계좌 비밀번호
   * @param connection MariaDB 연결 객체
   * @returns 삽입 결과
   */
  static async create(
    accountUuid: string,
    userId: string,
    accountNumber: string,
    password: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        INSERT INTO account (account_uuid, user_id, account_number, password)
        VALUES (?, ?, ?, ?)
      `,
      [accountUuid, userId, accountNumber, password]
    );

    return result;
  }

  /**
   * 계좌 내 크레딧 출금
   * @param accountId 계좌 id
   * @param amount 출금 금액
   * @param connection MariaDB 연결 객체
   */
  static async withdraw(
    accountId: string,
    amount: number,
    connection: PoolConnection | Pool
  ) {
    await connection.execute(
      `
        UPDATE account
        SET credit = credit - ?
        WHERE account_id = ?;
      `,
      [amount, accountId]
    );
  }

  /**
   * 계좌 내 크레딧 입금
   * @param accountId 계좌 id
   * @param amount 입금 금액
   * @param connection MariaDB 연결 객체
   */
  static async deposit(
    accountId: string,
    amount: number,
    connection: PoolConnection | Pool
  ) {
    await connection.execute(
      `
        UPDATE account
        SET credit = credit + ?
        WHERE account_id = ?;
      `,
      [amount, accountId]
    );
  }

  /**
   * 최근 거래 계좌 조회
   * @param accountId 계좌 id
   * @param connection MariaDB 연결 객체
   * @returns 계좌 목록
   */
  static async findRecentAccountsByAccountId(
    accountId: string,
    connection: PoolConnection | Pool
  ) {
    const [accounts] = await connection.execute(
      `
        SELECT DISTINCT a.*
        FROM transaction t
        JOIN account a ON (t.sender_account_id = a.account_id OR t.receiver_account_id = a.account_id)
        WHERE (t.sender_account_id = ?
          OR t.receiver_account_id = ?)
          AND a.account_id != ?
        ORDER BY t.transaction_id DESC
        LIMIT 10;
      `,
      [accountId, accountId, accountId]
    );

    if (!accounts) {
      return [];
    }

    console.log(accounts);

    const formattedAccounts = (accounts as any[]).map((account: any) =>
      this.formatAccount(account)
    );
    return formattedAccounts;
  }

  /**
   * 계좌 데이터 포맷팅
   * @param data 계좌 데이터
   * @returns 포맷팅된 계좌 모델
   */
  private static formatAccount(data: any) {
    if (!data) {
      return null;
    }

    return new AccountModel({
      id: data.account_id,
      uuid: data.account_uuid,
      userId: data.user_id,
      accountNumber: data.account_number,
      password: data.password,
      status: data.status,
      credit: data.credit,
      createdAt: data.created_at,
    });
  }
}

export default AccountModel;
