import Redis from "ioredis";
import { parseTimeToSeconds } from "../utils";

export class AuthModel {
  /**
   * 리프레시 토큰 저장
   * @param userId 사용자 id
   * @param refreshToken 리프레시 토큰
   * @param connection Redis 연결 객체
   * @return 저장 결과
   */
  static async storeRefreshToken(
    userId: string,
    refreshToken: string,
    connection: Redis,
  ): Promise<string> {
    const result = await connection.setex(
      `refreshToken:${userId}`,
      parseTimeToSeconds(process.env.JWT_REFRESH_EXPIRES_IN!),
      refreshToken,
    );
    return result;
  }

  /**
   * 사용자 id로 리프레시 토큰 삭제
   * @param userId 사용자 id
   * @param connection Redis 연결 객체
   * @return 삭제 결과
   */
  static async deleteRefreshToken(
    userId: string,
    connection: Redis,
  ): Promise<number> {
    const result = await connection.del(`refreshToken:${userId}`);
    return result;
  }
}
