import { dbPool } from "../config/db";
import { NotFoundError } from "../errors/CustomErrors";
import ApiKeyModel from "../models/apikey.model";

class ApiKeyService {
  /**
   * API 키 유효성 검사
   * @param apiKey API 키
   * @returns API키 유효성 여부
   */
  static async validateApiKey(apiKey: string) {
    // API키 유효성 검사
    const apikey = await ApiKeyModel.findByUuid(apiKey, dbPool);
    if (!apikey) {
      throw new NotFoundError("API 키가 존재하지 않습니다.");
    } else if (apikey.status !== "active") {
      throw new NotFoundError("API 키가 비활성 상태입니다.");
    }

    return true;
  }
}

export default ApiKeyService;
