import { Pool, PoolConnection } from "mariadb/*";

class ApiKeyModel {
  /**
   * API키 id로 API키 조회
   * @param apikeyId API키 id
   * @param connection 데이터베이스 연결 객체
   * @returns API키 정보
   */
  static async findById(apikeyId: string, connection: PoolConnection | Pool) {
    const [apiKey] = await connection.execute(
      `
        SELECT *
        FROM apikey
        WHERE key_id = ?
      `,
      [apikeyId]
    );

    return apiKey;
  }

  /**
   * API키 uuid로 API키 조회
   * @param apikeyUuid API키 uuid
   * @param connection 데이터베이스 연결 객체
   * @returns API키 정보
   */
  static async findByUuid(
    apikeyUuid: string,
    connection: PoolConnection | Pool
  ) {
    const [apiKey] = await connection.execute(
      `
        SELECT *
        FROM apikey
        WHERE key_uuid = ?
      `,
      [apikeyUuid]
    );

    return apiKey;
  }

  /**
   * 소유자 id로 API키 조회
   * @param ownerId 소유자 id
   * @param connection 데이터베이스 연결 객체
   * @returns API키 목록
   */
  static async findByOwnerId(
    ownerId: string,
    connection: PoolConnection | Pool
  ) {
    const apiKeys = await connection.execute(
      `
        SELECT *
        FROM apikey
        WHERE owner_id = ?
      `,
      [ownerId]
    );

    return apiKeys;
  }
}

export default ApiKeyModel;
