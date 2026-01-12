import { Pool, PoolConnection } from "mariadb/*";

class AccountModel {
  uuid: string;
  userId: string;
  accountNumber: string;
  password: string;
  status: string;
  credit: string;
  createdAt: Date;

  constructor(data: any) {
    this.uuid = data.uuid;
    this.userId = String(data.userId);
    this.accountNumber = data.accountNumber;
    this.password = data.password;
    this.status = data.status;
    this.credit = String(data.credit);
    this.createdAt = data.createdAt || new Date();
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
    return this.formatAccount(account);
  }

  /**
   * 사용자 id로 계좌 조회
   * @param userId 사용자 id
   * @param connection MariaDB 연결 객체
   * @returns 계좌 목록
   */
  static async findByUserId(userId: string, connection: PoolConnection | Pool) {
    const accounts = await connection.execute(
      `
        SELECT *
        FROM account
        WHERE user_id = ?
      `,
      [userId]
    );
    return accounts.map((account: any) => this.formatAccount(account));
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
   * 계좌 데이터 포맷팅
   * @param data 계좌 데이터
   * @returns 포맷팅된 계좌 모델
   */
  private static formatAccount(data: any) {
    if (!data) {
      return null;
    }

    return new AccountModel({
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
