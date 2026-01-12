import { Pool, PoolConnection } from "mariadb/*";
import { UserData } from "../types";

export class UserModel {
  id: string;
  uuid: string;
  steamId: string;
  steamName: string;
  avatar: string;
  status: "active" | "deleted" | "banned";
  createdAt: Date;
  lastLogin: Date;
  lastProfileRefresh: Date;

  constructor(data: any) {
    this.id = data.id || "";
    this.uuid = data.uuid;
    this.steamId = data.steamId;
    this.steamName = data.steamName;
    this.avatar = data.avatar;
    this.status = data.status;
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin || new Date();
    this.lastProfileRefresh = data.lastProfileRefresh || new Date();
  }

  /**
   * 사용자 id로 사용자 조회
   * @param userId 사용자 id
   * @param connection MariaDB 연결 객체
   * @returns 사용자 객체 또는 null
   */
  static async findById(userId: string, connection: PoolConnection | Pool) {
    const [result] = await connection.execute(
      `
        SELECT *
        FROM user
        WHERE user_id = ?
      `,
      [userId]
    );

    // 사용자가 없으면 null 반환
    if (!result) {
      return null;
    }

    // 사용자 객체 생성
    const user = this.formatUser(result);
    return user;
  }

  /**
   * 사용자 uuid로 사용자 조회
   * @param userUuid 사용자 uuid
   * @param connection MariaDB 연결 객체
   * @returns 사용자 객체 또는 null
   */
  static async findByUuid(userUuid: string, connection: PoolConnection | Pool) {
    const [result] = await connection.execute(
      `
        SELECT *
        FROM user
        WHERE user_uuid = ?
      `,
      [userUuid]
    );

    // 사용자가 없으면 null 반환
    if (!result) {
      return null;
    }

    // 사용자 객체 생성
    const user = this.formatUser(result);
    return user;
  }

  /**
   * Steam ID로 사용자 조회
   * @param steamId 사용자 Steam ID
   * @param connection MariaDB 연결 객체
   * @returns 사용자 객체 또는 null
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

    // 사용자가 없으면 null 반환
    if (!result) {
      return null;
    }

    // 사용자 객체 생성
    const user = this.formatUser(result);
    return user;
  }

  /**
   * 사용자 생성
   * @param userData 사용자 데이터
   * @param connection MariaDB 연결 객체
      createdAt: result.created_at,
      lastLogin: result.last_login_at,
    });
    return user;
  }

  /**
   * 사용자 생성
   * @param userData 사용자 데이터
   * @param connection MariaDB 연결 객체
   * @returns 사용자 모델 객체
   */
  static async create(
    userData: UserData,
    connection: PoolConnection | Pool
  ): Promise<UserModel> {
    await connection.execute(
      `
        INSERT INTO user (user_uuid, steam_id, steam_name, avatar, created_at, last_login_at) 
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
   * 사용자 스팀 정보 업데이트
   * @param userId 사용자 id
   * @param steamName 스팀 이름
   * @param avatar 아바타 URL
   * @param connection MariaDB 연결 객체
   * @returns
   */
  static async updateSteamInfo(
    userId: string,
    steamName: string,
    avatar: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        UPDATE user
        SET steam_name = ?, avatar = ?, last_profile_refresh_at = NOW()
        WHERE user_id = ?
      `,
      [steamName, avatar, userId]
    );
    return result;
  }

  /**
   * 사용자 삭제 (회원 탈퇴)
   * @param userId 사용자 id
   * @param connection MariaDB 연결 객체
   * @returns 삭제 결과
   */
  static async deleteById(userId: string, connection: PoolConnection | Pool) {
    const result = await connection.execute(
      `
        UPDATE user
        SET status = 'deleted'
        WHERE user_id = ?
      `,
      [userId]
    );
    return result;
  }

  /**
   * 마지막 로그인 시간 업데이트
   * @param userId 사용자 id
   * @param connection MariaDB 연결 객체
   * @return 업데이트 결과
   */
  static async stampLastLogin(
    userId: string,
    connection: PoolConnection | Pool
  ) {
    const result = await connection.execute(
      `
        UPDATE user
        SET last_login_at = NOW()
        WHERE user_id = ?
      `,
      [userId]
    );
    return result;
  }

  /**
   * 사용자 id로 사용자 상태 조회
   * @param userId 사용자 id
   * @param connection MariaDB 연결 객체
   * @returns 사용자 상태
   */
  static async getStatusById(
    userId: string,
    connection: PoolConnection | Pool
  ) {
    const [result] = await connection.execute(
      `
        SELECT status
        FROM user
        WHERE user_id = ?
      `,
      [userId]
    );
    return (result as any).status;
  }

  /**
   * 사용자 데이터 객체 포맷팅
   * @param data DB 쿼리 결과
   * @returns 사용자 객체
   */
  private static formatUser(data: any) {
    if (!data) {
      return null;
    }

    const user = new UserModel({
      id: String(data.user_id),
      uuid: data.user_uuid,
      steamId: data.steam_id,
      steamName: data.steam_name,
      avatar: data.avatar,
      createdAt: data.created_at,
      lastLogin: data.last_login_at,
      lastProfileRefresh: data.last_profile_refresh_at,
    });
    return user;
  }
}
