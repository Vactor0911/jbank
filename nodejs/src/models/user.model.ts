import { Pool, PoolConnection } from "mariadb/*";
import { UserData } from "../types";

export class UserModel {
  uuid: string;
  steamId: string;
  steamName: string;
  avatar: string;
  createdAt: Date;
  lastLogin: Date;

  constructor(data: UserData) {
    this.uuid = data.uuid;
    this.steamId = data.steamId;
    this.steamName = data.steamName;
    this.avatar = data.avatar;
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin || new Date();
  }

  /**
   * Steam ID로 사용자 조회
   * @param steamId 사용자 Steam ID
   * @param connection 데이터베이스 연결 객체
   * @returns 사용자 데이터 또는 null
   */
  static async findBySteamId(
    steamId: string,
    connection: PoolConnection | Pool
  ): Promise<UserModel | null> {
    const [result] = await connection.execute(
      `
        SELECT *
        FROM user
        WHERE steam_id = ?
      `,
      [steamId]
    );

    // 사용자 객체 생성
    const user = {
      uuid: result.user_uuid,
      steamId: result.steam_id,
      steamName: result.steam_name,
      avatar: result.avatar,
      createdAt: result.created_at,
      lastLogin: result.last_login_at,
    } as UserData;
    return new UserModel(user);
  }

  /**
   * 사용자 생성
   * @param userData 사용자 데이터
   * @param connection 데이터베이스 연결 객체
   * @returns 사용자 모델 객체
   */
  static async create(
    userData: UserData,
    connection: PoolConnection | Pool
  ): Promise<UserModel> {
    await connection.execute(
      `
        INSERT INTO user (user_uuid, steam_id, steam_name, avatar, created_at, last_login) 
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userData.uuid,
        userData.steamId,
        userData.steamName,
        userData.avatar,
        userData.createdAt,
        userData.lastLogin,
      ]
    );
    return new UserModel(userData);
  }

  /**
   * 마지막 로그인 시간 업데이트
   * @param userId 사용자 id
   * @param connection 데이터베이스 연결 객체
   * @return 업데이트 결과
   */
  static async updateLastLogin(
    userId: string,
    connection: PoolConnection | Pool
  ): Promise<void> {
    const result = await connection.execute(
      `
        UPDATE user
        SET last_login = NOW()
        WHERE user_id = ?
      `,
      [userId]
    );
    return result;
  }

  /**
   * 리프레시 토큰 저장
   * @param userId 사용자 id
   * @param refreshToken 리프레시 토큰
   * @param connection 데이터베이스 연결 객체
   * @return 저장 결과
   */
  static async storeRefreshToken(
    userId: string,
    refreshToken: string,
    connection: PoolConnection | Pool
  ): Promise<void> {
    const result = await connection.execute(
      `
        UPDATE user
        SET refresh_token = ?
        WHERE user_id = ?
      `,
      [refreshToken, userId]
    );
    return result;
  }

  /**
   * 사용자 id로 리프레시 토큰 삭제
   * @param userId 사용자 id
   * @param connection 데이터베이스 연결 객체
   * @return 삭제 결과
   */
  static async deleteRefreshTokenByUuid(
    userId: string,
    connection: PoolConnection | Pool
  ): Promise<void> {
    const result = await connection.execute(
      `
        UPDATE user
        SET refresh_token = NULL
        WHERE user_id = ?
      `,
      [userId]
    );
    return result;
  }
}
