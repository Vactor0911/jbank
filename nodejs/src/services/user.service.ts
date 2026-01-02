import { v4 as uuidv4 } from "uuid";
import TransactionHandler from "../utils/transactionHandler";
import { dbPool } from "../config/db";
import UserModel from "../models/user.model";
import { ConflictError, NotFoundError } from "../errors/CustomErrors";
import AccountModel from "../models/account.model";
import { generateAccountNumber } from "../utils/account";
import bcrypt from "bcrypt";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

class UserService {
  /**
   * Steam 프로필에서 사용자 이름 추출
   * @param steamId 스팀 고유번호 (SteamID64)
   * @returns 스팀 사용자 이름
   */
  private static async fetchSteamUserName(steamId: string): Promise<string> {
    try {
      const url = `https://steamcommunity.com/profiles/${steamId}?xml=1`;
      const response = await axios.get(url);

      const xmlText = response.data;

      // XMLParser를 사용하여 XML 파싱
      const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true,
      });
      const parsed = parser.parse(xmlText);

      // 사용자 이름 추출
      const steamUserName = parsed?.profile?.steamID;
      if (!steamUserName) {
        // 사용자 이름이 없으면 스팀 고유번호 그대로 반환
        return steamId;
      }

      // 공백 제거 후 반환
      return steamUserName.trim();
    } catch (error) {
      // 오류 발생 시 스팀 고유번호 그대로 반환
      return steamId;
    }
  }

  /**
   * 사용자 생성
   * @param steamId 스팀 고유번호 (SteamID64)
   * @param password 4자리 숫자 비밀번호
   * @returns 생성된 사용자 uuid
   */
  static async createUser(steamId: string, password: string) {
    const userUuid = await TransactionHandler.executeInTransaction(
      dbPool,
      async (connection) => {
        // 스팀 고유번호 중복 확인
        const existingUser = await UserModel.findBySteamId(steamId, connection);
        if (existingUser) {
          throw new ConflictError("이미 존재하는 스팀 고유번호입니다.");
        }

        // 스팀 고유번호로 사용자명 조회
        let steamUserName = await this.fetchSteamUserName(steamId);

        // 사용자명 길이 제한 (최대 20자)
        if (steamUserName.length > 20) {
          steamUserName = steamUserName.slice(0, 20);
        }

        // 사용자 생성
        const userUuid = uuidv4();
        const result = await UserModel.create(
          userUuid,
          steamId,
          steamUserName,
          connection
        );

        // 계좌 개설
        const accountUuid = uuidv4();
        const userId = result.insertId;
        const accountNumber = generateAccountNumber(userUuid);
        const hashedPassword = await bcrypt.hash(password, 10);
        await AccountModel.create(
          accountUuid,
          userId,
          accountNumber,
          hashedPassword,
          connection
        );

        // 생성된 사용자 uuid 반환
        return userUuid;
      }
    );

    // 결과 반환
    return userUuid;
  }

  /**
   * 검색 키워드로 사용자 검색
   * @param keyword 검색 키워드 (사용자명 또는 SteamID64)
   * @returns 검색된 사용자 목록
   */
  static async searchUsers(keyword: string) {
    // 사용자명으로 사용자 조회
    const usersWithName = await UserModel.findByName(keyword, dbPool);

    // SteamID64로 사용자 조회
    const usersWithSteamId = await UserModel.findBySteamId(keyword, dbPool);

    // 결과 병합
    const normalizeToArray = (data: any) =>
      Array.isArray(data) ? data : data ? [data] : [];

    const searchResults = [
      ...normalizeToArray(usersWithName),
      ...normalizeToArray(usersWithSteamId),
    ];

    const userMap = new Map(
      searchResults.map((user) => [user.user_id, this.formatUser(user)])
    );

    const users = Array.from(userMap.values());
    if (users.length === 0) {
      throw new NotFoundError("검색된 사용자가 없습니다.");
    }

    // 결과 반환
    return users;
  }

  /**
   * 사용자 상태 업데이트
   * @param userId 사용자 ID
   * @param status 업데이트할 상태 (active, disabled, banned)
   */
  static async updateUserStatus(
    userId: string,
    status: "active" | "disabled" | "banned"
  ) {
    const result = await TransactionHandler.executeInTransaction(
      dbPool,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findById(userId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // 사용자 상태 업데이트
        const result = await UserModel.updateStatus(userId, status, connection);

        // 업데이트 결과 반환
        return result;
      }
    );

    // 결과 반환
    return result;
  }

  /**
   * 사용자 사용자명 재설정
   * @param steamId 스팀 고유번호 (SteamID64)
   */
  static async refreshUserName(steamId: string) {
    const result = await TransactionHandler.executeInTransaction(
      dbPool,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findBySteamId(steamId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // 스팀 고유번호로 사용자명 조회
        let steamUserName = await this.fetchSteamUserName(steamId);

        // 사용자명 길이 제한 (최대 20자)
        if (steamUserName.length > 20) {
          steamUserName = steamUserName.slice(0, 20);
        }

        // 사용자명 업데이트
        const result = await UserModel.updateName(
          user.user_id,
          steamUserName,
          connection
        );

        // 업데이트 결과 반환
        return result;
      }
    );

    // 결과 반환
    return result;
  }

  /**
   * 사용자 정보 포맷팅
   * @param user 사용자 db 쿼리 결과
   * @returns 포맷팅된 사용자 정보
   */
  private static formatUser(user: any) {
    return {
      uuid: user.user_uuid,
      name: user.name,
      steamId: user.steam_id,
      status: user.status,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}

export default UserService;
