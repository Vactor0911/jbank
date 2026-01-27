import { Request, Response } from "express";
import { APIResponse, JwtRequest } from "../types";
import { UserModel } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthService } from "../services/auth.service";
import { verifyRefreshToken } from "../utils/jwt";
import { mariaDB } from "../config/mariadb";
import { ForbiddenError, NotFoundError } from "../errors/CustomErrors";
import { AuthModel } from "../models/auth.model";
import { redis } from "../config/redis";
import { deleteCsrfToken, generateCsrfToken } from "../middlewares/csrf";
import crypto from "crypto";
import { UserService } from "../services/user.service";
import AppError from "../errors/AppError";

export class AuthController {
  /**
   * Steam 로그인
   */
  static login = asyncHandler(async (req: JwtRequest, res: Response) => {
    // 요청 헤더에서 사용자 정보 추출
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/jbank/login?error=no_user`);
    }

    // UserModel 인스턴스에서 steamId 추출
    const steamId = user.steamId;
    const userId = user.id;

    if (!steamId) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/jbank/login?error=no_steam_id`
      );
    }

    // 로그인 처리
    let tokens;
    try {
      tokens = await AuthService.login(steamId);
    } catch (error) {
      // 예상치 못한 오류는 그대로 반환
      if (!(error instanceof AppError)) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/jbank/login?error=internal_error`
        );
      }

      // 오류에 따른 리다이렉트 처리
      if (error instanceof NotFoundError) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/jbank/login?error=user_not_found`
        );
      } else if (
        error instanceof ForbiddenError &&
        error.message === "삭제된 계정입니다."
      ) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/jbank/login?error=account_deleted`
        );
      } else if (
        error instanceof ForbiddenError &&
        error.message === "차단된 계정입니다."
      ) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/jbank/login?error=account_banned`
        );
      }

      // 그 외의 에러
      return res.redirect(
        `${process.env.FRONTEND_URL}/jbank/login?error=internal_error`
      );
    }

    // 사용자 스팀 프로필 업데이트
    try {
      if (userId) {
        await UserService.autoRefreshProfile(userId);
      }
    } catch {}

    // 로그인 정보 교환용 임시 코드 생성
    const tempAuthCode = crypto.randomBytes(32).toString("hex");
    await redis.setex(
      `auth:${tempAuthCode}`,
      60,
      JSON.stringify({
        accessToken: tokens.accessToken,
        csrfToken: tokens.csrfToken,
      })
    );

    // Refresh Token을 HttpOnly 쿠키로 설정
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // 프론트엔드로 리다이렉트
    res.redirect(`${process.env.FRONTEND_URL}/jbank/login?code=${tempAuthCode}`);
  });

  static exchangeTokens = asyncHandler(
    async (req: Request, res: Response<APIResponse>) => {
      const { code } = req.params;

      // 임시 코드로부터 토큰 조회
      const tokenData = await redis.get(`auth:${code}`);
      if (!tokenData) {
        throw new NotFoundError("유효하지 않은 코드입니다.");
      }

      // 임시 코드 삭제
      await redis.del(`auth:${code}`);

      // 토큰 파싱
      const { accessToken, csrfToken } = JSON.parse(tokenData);

      // 응답 전송
      res.json({
        success: true,
        message: "토큰 교환에 성공했습니다.",
        accessToken,
        csrfToken,
      });
    }
  );

  /**
   * Refresh Token으로 Access Token 재발급
   */
  static refreshJwtToken = asyncHandler(
    async (req: JwtRequest, res: Response<APIResponse>) => {
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
    async (req: JwtRequest, res: Response<APIResponse>) => {
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
    async (req: JwtRequest, res: Response<APIResponse>) => {
      const { refreshToken } = req.cookies;

      // Refresh Token 삭제
      if (refreshToken) {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded) {
          // Refresh Token 삭제
          await AuthModel.deleteRefreshToken(decoded.userId, redis);

          // CSRF 토큰 삭제
          await deleteCsrfToken(decoded.userId);
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
}
