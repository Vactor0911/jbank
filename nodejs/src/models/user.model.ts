import { Pool, PoolConnection } from "mariadb/*";

class UserModel {
  /**
   * 사용자 id로 사용자 조회
   * @param userId 사용자 id
   * @param connection 데이터베이스 연결 객체
   * @returns 사용자 정보
   */
  static async findById(userId: string, connection: PoolConnection | Pool) {
    const [user] = await connection.execute(
      `
        SELECT *
        FROM user
        WHERE user_id = ?
      `,
      [userId]
    );

    return user;
  }

  /**
   * 사용자 uuid로 사용자 조회
   * @param userUuid 사용자 uuid
   * @param connection 데이터베이스 연결 객체
   * @returns 사용자 정보
   */
  static async findByUuid(userUuid: string, connection: PoolConnection | Pool) {
    const [user] = await connection.execute(
      `
        SELECT *
        FROM user
        WHERE user_uuid = ?
      `,
      [userUuid]
    );

    return user;
  }

  /**
   * 스팀 고유번호로 사용자 조회
   * @param steamId 스팀 고유번호 (SteamID64)
   * @param connection 데이터베이스 연결 객체
   * @returns 사용자 정보
   */
  static async findBySteamId(
    steamId: string,
    connection: PoolConnection | Pool
  ) {
    const [user] = await connection.execute(
      `
        SELECT *
        FROM user
        WHERE steam_id = ?
      `,
      [steamId]
    );

    return user;
  }

  /**
   * 사용자명으로 사용자 조회
   * @param name 사용자명
   * @param connection 데이터베이스 연결 객체
   * @returns 사용자 정보 목록
   */
  static async findByName(name: string, connection: PoolConnection | Pool) {
    const users = await connection.execute(
      `
        SELECT *
        FROM user
        WHERE name = ?
      `,
      [name]
    );

    return users;
  }

  /**
   * 사용자 생성
   * @param uuid 사용자 uuid
   * @param steamId 스팀 고유번호 (SteamID64)
   * @param name 사용자명
   * @param connection 데이터베이스 연결 객체
   * @returns 생성 결과
   */
  static async create(
    uuid: string,
    steamId: string,
    name: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        INSERT INTO user (user_uuid, steam_id, name)
        VALUES (?, ?, ?)
      `,
      [uuid, steamId, name]
    );

    return result;
  }

  /**
   * 사용자 상태 업데이트
   * @param userId 사용자 id
   * @param status 사용자 상태 ("active" | "disabled" | "banned")
   * @param connection 데이터베이스 연결 객체
   * @returns 업데이트 결과
   */
  static async updateStatus(
    userId: string,
    status: "active" | "disabled" | "banned",
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        UPDATE user
        SET status = ?
        WHERE user_id = ?
      `,
      [status, userId]
    );

    return result;
  }

  /**
   * 사용자명 업데이트
   * @param userId 사용자 id
   * @param name 새 사용자명
   * @param connection 데이터베이스 연결 객체
   * @returns 업데이트 결과
   */
  static async updateName(
    userId: string,
    name: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        UPDATE user
        SET name = ?
        WHERE user_id = ?
      `,
      [name, userId]
    );

    return result;
  }
}

export default UserModel;
