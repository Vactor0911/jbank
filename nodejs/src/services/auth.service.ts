import { UserModel } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { v4 as uuidv4 } from "uuid";
import TransactionHandler from "../utils/transactionHandler";
import { dbPool } from "../config/db";
import { ForbiddenError, NotFoundError } from "../errors/CustomErrors";

export class AuthService {
  /**
   * 로그인 처리
   * @param userData 사용자 데이터
   * @returns Access Token 및 Refresh Token
   */
  static async login(userData: any) {
    const tokens = await TransactionHandler.executeInTransaction(
      dbPool,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findBySteamId(
          userData.steamId,
          connection
        );
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // Access Token 및 Refresh Token 생성
        const accessToken = generateAccessToken(userData);
        const refreshToken = generateRefreshToken(userData);

        // 마지막 로그인 시간 업데이트
        await UserModel.create(
          {
            ...userData,
            lastLogin: new Date(),
          },
          dbPool
        );

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
    const user = await UserModel.findBySteamId(decoded.userUuid, dbPool);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 새로운 Access Token 발급
    const newAccessToken = generateAccessToken(user);

    // Refresh Token 로테이션
    const newRefreshToken = generateRefreshToken(user);

    // 새로운 토큰 반환
    const tokens = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
    return tokens;
  }
}
