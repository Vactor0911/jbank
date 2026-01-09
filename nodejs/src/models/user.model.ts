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
    // TODO: DB 조회 로직 구현

    // 임시 반환
    console.log("Finding user by Steam ID:", steamId);
    return null;
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
    // TODO: 저장 로직 구현

    // 임시 반환
    console.log("Creating user with data:", userData);
    return new UserModel(userData);
  }

  /**
   * 마지막 로그인 시간 업데이트
   * @param userId 사용자 id
   * @param connection 데이터베이스 연결 객체
   */
  static async updateLastLogin(
    userId: string,
    connection: PoolConnection | Pool
  ): Promise<void> {
    // TODO: 업데이트 로직 구현

    // 임시 반환
    console.log("Updating last login for user ID:", userId);
  }

  /**
   * 리프레시 토큰 저장
   * @param userId 사용자 id
   * @param refreshToken 리프레시 토큰
   * @param connection 데이터베이스 연결 객체
   */
  static async storeRefreshToken(
    userId: string,
    refreshToken: string,
    connection: PoolConnection | Pool
  ): Promise<void> {
    // TODO: 저장 로직 구현

    // 임시 반환
    console.log(
      "Storing refresh token for user ID:",
      userId,
      "Token:",
      refreshToken
    );
  }

  /**
   * 사용자 id로 리프레시 토큰 삭제
   * @param userId 사용자 id
   * @param connection 데이터베이스 연결 객체
   */
  static async deleteRefreshTokenByUuid(
    userId: string,
    connection: PoolConnection | Pool
  ): Promise<void> {
    // TODO: 삭제 로직 구현

    // 임시 반환
    console.log("Deleting refresh token for user ID:", userId);
  }
}
