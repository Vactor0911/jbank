import { Pool, PoolConnection } from "mariadb/*";

class LogModel {
  /**
   * 로그 생성
   * @param logUuid 로그 uuid
   * @param apiKey 사용한 API 키
   * @param action 처리 종류
   * @param detail 세부 내용
   * @param connection 데이터베이스 연결 객체
   * @returns 로그 생성 결과
   */
  static async create(
    logUuid: string,
    apiKey: string,
    action: string,
    detail: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        INSERT INTO log (log_uuid, api_key, action, detail)
        VALUES (?, ?, ?, ?)
      `,
      [logUuid, apiKey, action, detail]
    );

    return result;
  }
}

export default LogModel;
