import { Pool, PoolConnection } from "mariadb/*";

class AccountModel {
  /**
   * 계좌 id로 계좌 조회
   * @param accountId 계좌 id
   * @param connection 데이터베이스 연결 객체
   * @returns 계좌 정보
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

    return account;
  }

  /**
   * 계좌 uuid로 계좌 조회
   * @param accountUuid 계좌 uuid
   * @param connection 데이터베이스 연결 객체
   * @returns 계좌 정보
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

    return account;
  }

  /**
   * 예금주 id로 계좌 조회
   * @param userId 예금주 id
   * @param connection 데이터베이스 연결 객체
   * @returns 계좌 정보
   */
  static async findByOwnerId(
    userId: string,
    connection: PoolConnection | Pool
  ) {
    const [account] = await connection.execute(
      `
        SELECT *
        FROM account
        WHERE user_id = ?
      `,
      [userId]
    );

    return account;
  }

  /**
   * 계좌 번호로 계좌 조회
   * @param accountNumber 계좌 번호
   * @param connection 데이터베이스 연결 객체
   * @returns 계좌 정보
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

    return account;
  }

  /**
   * 계좌 개설
   * @param accountUuid 계좌 uuid
   * @param userId 예금주 id
   * @param accountNumber 계좌 번호
   * @param hashedPassword 해시된 비밀번호
   * @param connection 데이터베이스 연결 객체
   * @returns 생성 결과
   */
  static async create(
    accountUuid: string,
    userId: string,
    accountNumber: string,
    hashedPassword: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        INSERT INTO account (account_uuid, user_id, account_number, password)
        VALUES (?, ?, ?, ?)
      `,
      [accountUuid, userId, accountNumber, hashedPassword]
    );

    return result;
  }

  /**
   * 계좌번호로 계좌 상세 정보 조회
   * @param accountNumber 계좌번호
   * @param connection 데이터베이스 연결 객체
   * @returns 계좌 상세 정보
   */
  static async searchByAccountNumber(
    accountNumber: string,
    connection: PoolConnection | Pool
  ) {
    const [account] = await connection.execute(
      `
        SELECT a.*, u.name AS owner_name, u.steam_id AS owner_steam_id
        FROM account a
        JOIN user u ON a.user_id = u.user_id
        WHERE a.account_number = ?
      `,
      [accountNumber]
    );

    return account;
  }
}

export default AccountModel;
