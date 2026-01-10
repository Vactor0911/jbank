import { Response } from "express";
import { APIResponse, AuthRequest } from "../types";
import { UserModel } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthService } from "../services/auth.service";
import { verifyRefreshToken } from "../utils/jwt";
import { mariaDB } from "../config/mariadb";
import { NotFoundError } from "../errors/CustomErrors";
import { AuthModel } from "../models/auth.model";
import { redis } from "../config/redis";
import { deleteCsrfToken, generateCsrfToken } from "../middlewares/csrf";

export class AuthController {
  /**
   * Steam 로그인
   */
  static login = asyncHandler(async (req: AuthRequest, res: Response) => {
    // 요청 헤더에서 사용자 정보 추출
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }

    // 로그인 처리
    const tokens = await AuthService.login(user.steamId);

    // Refresh Token을 HttpOnly 쿠키로 설정
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // 응답 반환
    res.json({
      success: true,
      message: "로그인 성공",
      accessToken: tokens.accessToken,
      csrfToken: tokens.csrfToken,
    });
  });

  /**
   * Refresh Token으로 Access Token 재발급
   */
  static refreshJwtToken = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { refreshToken } = req.cookies;

      // 새로운 토큰 발급
      const tokens = await AuthService.rotateTokens(refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      // 응답 전송
      res.json({
        success: true,
        message: "토큰이 재발급되었습니다.",
        accessToken: tokens.accessToken,
      });
    }
  );

  static refreshCsrfToken = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };

      // 새로운 CSRF 토큰 발급
      const csrfToken = await generateCsrfToken(userId);

      // 응답 전송
      res.json({
        success: true,
        message: "CSRF 토큰이 재발급되었습니다.",
        csrfToken,
      });
    }
  );

  /**
   * 로그아웃
   */
  static logout = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { refreshToken } = req.cookies;

      // Refresh Token 삭제
      if (refreshToken) {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded) {
          // Refresh Token 삭제
          await AuthModel.deleteRefreshToken(decoded.userUuid, redis);

          // CSRF 토큰 삭제
          await deleteCsrfToken(decoded.userUuid);
        }
      }

      // 쿠키 삭제
      res.clearCookie("refreshToken");

      // 응답 전송
      res.json({
        success: true,
        message: "로그아웃되었습니다.",
      });
    }
  );

  /**
   * 내 정보 조회
   */
  static me = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userUuid } = req.user as { userUuid: string };

      // 사용자 정보 조회
      const user = await UserModel.findBySteamId(userUuid, mariaDB);
      if (!user) {
        throw new NotFoundError("사용자를 찾을 수 없습니다.");
      }

      // 응답 전송
      res.json({
        success: true,
        message: "사용자 정보 조회 성공.",
        data: {
          user: {
            uuid: user.uuid,
            steamId: user.steamId,
            steamName: user.steamName,
            avatar: user.avatar,
          },
        },
      });
    }
  );
}
