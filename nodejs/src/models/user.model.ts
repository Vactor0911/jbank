import { UserData } from "../types";

export class UserModel {
  uuid: string;
  steamId: string;
  steamName: string;
  avatar: string;
  profileUrl: string;
  createdAt: Date;
  lastLogin: Date;

  constructor(data: UserData) {
    this.uuid = data.uuid;
    this.steamId = data.steamId;
    this.steamName = data.steamName;
    this.avatar = data.avatar;
    this.profileUrl = data.profileUrl;
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin || new Date();
  }

  /**
   * Steam ID로 사용자 조회
   * @param steamId 사용자 Steam ID
   * @returns 사용자 데이터 또는 null
   */
  static async findBySteamId(steamId: string): Promise<UserModel | null> {
    // TODO: DB 조회 로직 구현

    // 임시 반환
    console.log("Finding user by Steam ID:", steamId);
    return null;
  }

  /**
   * 사용자 생성 또는 업데이트
   * @param userData 사용자 데이터
   * @returns 사용자 모델 객체
   */
  static async createOrUpdate(userData: UserData): Promise<UserModel> {
    // TODO: 저장 로직 구현

    // 임시 반환
    console.log("Creating user with data:", userData);
    return new UserModel(userData);
  }
}
