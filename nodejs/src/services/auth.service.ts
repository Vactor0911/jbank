import { UserModel } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import TransactionHandler from "../utils/transactionHandler";
import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from "../errors/CustomErrors";
import { redis } from "../config/redis";
import { AuthModel } from "../models/auth.model";
import { generateCsrfToken } from "../middlewares/csrf";
import { mariaDB } from "../config/mariadb";

export class AuthService {
  /**
   * 로그인 처리
   * @param steamId 사용자 Steam ID
   * @returns Access Token ,Refresh Token 및 CSRF Token
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

        // 사용자 계정 상태 확인
        const userStatus = await UserModel.getStatusById(user.id, connection);
        if (userStatus === "deleted") {
          throw new ForbiddenError("삭제된 계정입니다.");
        } else if (userStatus === "banned") {
          throw new ForbiddenError("차단된 계정입니다.");
        }

        // Access Token 및 Refresh Token 생성
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Refresh Token 저장
        await AuthModel.storeRefreshToken(user.id, refreshToken, redis);

        // CSRF 토큰 생성 및 저장
        const csrfToken = await generateCsrfToken(user.id);

        // 마지막 로그인 시간 업데이트
        await UserModel.stampLastLogin(user.id, connection);

        // 토큰 반환
        const tokens = { accessToken, refreshToken, csrfToken };
        return tokens;
      },
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

    const { userUuid } = decoded;

    // userUuid 검증 추가
    if (!userUuid) {
      throw new BadRequestError("사용자 uuid가 없습니다.");
    }

    // 사용자 정보 조회
    const user = await UserModel.findByUuid(userUuid, mariaDB);
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
