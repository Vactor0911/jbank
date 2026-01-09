import { Response } from "express";
import { APIResponse, AuthRequest } from "../types";
import { UserModel } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthService } from "../services/auth.service";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { dbPool } from "../config/db";

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
    const tokens = await AuthService.login(user);

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
    });
  });

  /**
   * Refresh Token으로 Access Token 재발급
   */
  static refreshToken = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      // 쿠키에서 Refresh Token 추출
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "토큰이 없습니다.",
        });
      }

      // Refresh Token 검증
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(403).json({
          success: false,
          message: "유효하지 않거나 만료된 토큰입니다.",
        });
      }

      // 사용자 정보 조회
      const user = await UserModel.findBySteamId(decoded.userUuid, dbPool);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      // 새로운 Access Token 발급
      const newAccessToken = generateAccessToken(user);

      // Refresh Token 로테이션
      const newRefreshToken = generateRefreshToken(user);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      // 응답 전송
      res.json({
        success: true,
        message: "토큰이 재발급되었습니다.",
        accessToken: newAccessToken,
      });
    }
  );

  /**
   * 로그아웃
   */
  static logout = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      // 쿠키에서 Refresh Token 추출
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return;
      }

      // DB에서 Refresh Token 삭제
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded) {
        await UserModel.deleteRefreshTokenByUuid(decoded.userUuid, dbPool);
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
      // 요청 헤더에서 토큰 추출
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "인증이 필요합니다.",
        });
      }

      // Access Token 검증
      const decoded = verifyAccessToken(token);
      if (!decoded) {
        return res.status(403).json({
          success: false,
          message: "유효하지 않거나 만료된 토큰입니다.",
        });
      }

      // 사용자 정보 조회
      const user = await UserModel.findBySteamId(decoded.userUuid, dbPool);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
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
