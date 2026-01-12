import { Pool, PoolConnection } from "mariadb/*";

class AccountModel {
  uuid: string;
  accountNumber: string;
  status: string;
  credit: string;
  createdAt: Date;

  constructor(data: any) {
    this.uuid = data.uuid;
    this.accountNumber = data.accountNumber;
    this.status = data.status;
    this.credit = String(data.credit);
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * 사용자 id로 계좌 조회
   * @param userId 사용자 id
   * @param connection 데이터베이스 연결
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
    return accounts.map((account: any) => new AccountModel(account));
  }
}

export default AccountModel;
