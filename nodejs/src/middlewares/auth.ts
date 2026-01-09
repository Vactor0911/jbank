import { NextFunction, Response } from "express";
import { APIResponse, AuthRequest } from "../types";
import { verifyAccessToken } from "../utils/jwt";

/**
 * JWT 토큰 인증 미들웨어
 * @param req API 요청 객체
 * @param res API 응답 객체
 * @param next 다음 미들웨어 호출 함수
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
): void => {
  // 헤더에서 토큰 추출
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: "인증 토큰이 필요합니다.",
    });
    return;
  }

  // 토큰 검증
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(403).json({
      success: false,
      message: "유효하지 않거나 만료된 인증 토큰입니다.",
    });
    return;
  }

  // 요청에 사용자 정보 추가
  req.user = decoded;
  next();
};

/**
 * 선택적 인증 미들웨어
 * @param req API 요청 객체
 * @param res API 응답 객체
 * @param next 다음 미들웨어 호출 함수
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // 헤더에서 토큰 추출
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 토큰이 있으면 검증 시도
  if (token) {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  // 다음 미들웨어 호출
  next();
};
