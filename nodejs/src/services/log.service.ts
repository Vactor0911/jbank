import LogModel from "../models/log.model";
import { v4 as uuidv4 } from "uuid";
import { dbPool } from "../config/db";

class LogService {
  /**
   * 사용자 생성 로그 기록
   * @param apiKey 사용된 API 키
   * @param userUuid 생성된 사용자 uuid
   */
  static async logUserCreation(apiKey: string, userUuid: string) {
    const logUuid = uuidv4();
    await LogModel.create(
      logUuid,
      apiKey,
      "user",
      `사용자 생성 : ${userUuid}`,
      dbPool
    );
  }

  /**
   * 사용자명 재설정 로그 기록
   * @param apiKey 사용된 API 키
   * @param steamId 스팀 고유번호 (SteamID64)
   * @param newUserName 새 사용자명
   */
  static async logUserNameRefresh(
    apiKey: string,
    steamId: string,
    newUserName: string
  ) {
    const logUuid = uuidv4();
    await LogModel.create(
      logUuid,
      apiKey,
      "user",
      `사용자명 재설정 : ${steamId} -> ${newUserName}`,
      dbPool
    );
  }
}

export default LogService;
