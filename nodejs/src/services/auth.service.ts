import { UserModel } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import TransactionHandler from "../utils/transactionHandler";
import { mariaDB } from "../config/mariadb";
import { ForbiddenError, NotFoundError } from "../errors/CustomErrors";
import { redis } from "../config/redis";
import { AuthModel } from "../models/auth.model";

export class AuthService {
  /**
   * 로그인 처리
   * @param steamId 사용자 Steam ID
   * @returns Access Token 및 Refresh Token
   */
  static async login(steamId: any) {
    const tokens = await TransactionHandler.executeInTransaction(
      mariaDB,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findBySteamId(steamId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // Access Token 및 Refresh Token 생성
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Refresh Token 저장
        await AuthModel.storeRefreshToken(user.id, refreshToken, redis);

        // 마지막 로그인 시간 업데이트
        await UserModel.stampLastLogin(user.id, connection);

        // 토큰 반환
        const tokens = { accessToken, refreshToken };
        return tokens;
      }
    );

    return tokens;
  }

  /**
   * 토큰 재발급
   * @param refreshToken 리프레시 토큰
   * @returns 새로운 Access Token 및 Refresh Token
   */
  static async rotateTokens(refreshToken: string) {
    // Refresh Token 확인
    if (!refreshToken) {
      throw new NotFoundError("토큰이 없습니다.");
    }

    // Refresh Token 검증
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new ForbiddenError("유효하지 않거나 만료된 토큰입니다.");
    }

    // 사용자 정보 조회
    const user = await UserModel.findBySteamId(decoded.userUuid, mariaDB);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 새로운 Access Token 발급
    const newAccessToken = generateAccessToken(user);

    // Refresh Token 로테이션
    const newRefreshToken = generateRefreshToken(user);

    // 새로운 Refresh Token 저장
    await AuthModel.storeRefreshToken(user.id, newRefreshToken, redis);

    // 새로운 토큰 반환
    const tokens = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
    return tokens;
  }
}
