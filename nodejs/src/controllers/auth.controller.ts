import { Response } from "express";
import { APIResponse, AuthRequest } from "../types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { UserModel } from "../models/user.model";

export class AuthController {
  /**
   * Steam 로그인
   * @param req API 요청 객체
   * @param res API 응답 객체
   */
  static login = async (req: AuthRequest, res: Response) => {
    try {
      // 요청 헤더에서 사용자 정보 추출
      const user = req.user as any;
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
      }

      // Access Token 및 Refresh Token 생성
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Refresh Token을 HttpOnly 쿠키로 설정
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      // 마지막 로그인 시간 업데이트
      await UserModel.createOrUpdate({
        ...user,
        lastLogin: new Date(),
      });

      // 클라이언트로 리다이렉트
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`
      );
    } catch (error) {
      console.error("Steam authentication error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  };

  /**
   * Refresh Token으로 Access Token 재발급
   * @param req API 요청 객체
   * @param res API 응답 객체
   */
  static refreshToken = async (
    req: AuthRequest,
    res: Response<APIResponse>
  ) => {
    try {
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
      const user = await UserModel.findBySteamId(decoded.userUuid);
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
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        success: false,
        message: "토큰 갱신 중 오류가 발생했습니다.",
      });
    }
  };

  /**
   * 로그아웃
   * @param req API 요청 객체
   * @param res API 응답 객체
   */
  static logout = async (req: AuthRequest, res: Response<APIResponse>) => {
    try {
      // 쿠키에서 Refresh Token 추출
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return;
      }

      // DB에서 Refresh Token 삭제
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded) {
        await UserModel.deleteRefreshTokenByUuid(decoded.userUuid);
      }

      // 쿠키 삭제
      res.clearCookie("refreshToken");

      // 응답 전송
      res.json({
        success: true,
        message: "로그아웃되었습니다.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "로그아웃 중 오류가 발생했습니다.",
      });
    }
  };

  static me = async (req: AuthRequest, res: Response<APIResponse>) => {
    try {
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
      const user = await UserModel.findBySteamId(decoded.userUuid);
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
            profileUrl: user.profileUrl,
          },
        },
      });
    } catch (error) {
      console.error("Fetch user info error:", error);
      res.status(500).json({
        success: false,
        message: "사용자 정보 조회 중 오류가 발생했습니다.",
      });
    }
  };
}
