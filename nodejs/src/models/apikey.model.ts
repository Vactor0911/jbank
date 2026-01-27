import { Pool, PoolConnection } from "mysql2/promise";

class ApiKeyModel {
  id: string;
  uuid: string;
  userId: string;
  status: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = String(data.id);
    this.uuid = data.uuid;
    this.userId = String(data.userId);
    this.status = data.status;
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * 키로 API 키 조회
   * @param key API 키
   * @param connection MariaDB 연결 객체
   * @returns API 키 모델
   */
  static async findByKey(key: string, connection: PoolConnection | Pool) {
    const [apiKey] = await connection.execute(
      `
        SELECT *
        FROM apikey
        WHERE apikey = ?
      `,
      [key],
    );

    if (!(apiKey as any[])[0]) {
      return null;
    }

    const formattedApiKey = this.formatApiKey((apiKey as any[])[0]);
    return formattedApiKey;
  }

  /**
   * API 키 데이터 포맷팅
   * @param data 데이터 객체
   * @returns 포맷된 API 키 모델
   */
  private static formatApiKey(data: any) {
    if (!data) {
      return null;
    }

    return new ApiKeyModel({
      id: String(data.apikey_id),
      uuid: data.apikey_uuid,
      userId: String(data.user_id),
      status: data.status,
      createdAt: data.created_at,
    });
  }
}

export default ApiKeyModel;
