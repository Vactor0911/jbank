import { NextFunction, Response } from "express";
import { ApiKeyRequest, APIResponse, JwtRequest } from "../types";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import ApiKeyModel from "../models/apikey.model";
import { mariaDB } from "../config/mariadb";

/**
 * JWT 토큰 인증 미들웨어
 * @param req API 요청 객체
 * @param res API 응답 객체
 * @param next 다음 미들웨어 호출 함수
 */
export const authenticateJWT = (
  req: JwtRequest,
  res: Response<APIResponse>,
  next: NextFunction,
): void => {
  // 헤더에서 토큰 추출
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "인증 토큰이 필요합니다.",
    });
    return;
  }
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
export const optionalAuth = (req: JwtRequest, next: NextFunction): void => {
  // 헤더에서 토큰 추출
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // 토큰이 없으면 다음 미들웨어 호출
    next();
    return;
  }
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

/**
 * 리프레시 토큰 인증 미들웨어
 * @param req API 요청 객체
 * @param res API 응답 객체
 * @param next 다음 미들웨어 호출 함수
 */
export const authenticateRefreshToken = (
  req: JwtRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  // 쿠키에서 Refresh Token 추출
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    res.status(401).json({
      success: false,
      message: "인증 토큰이 필요합니다.",
    });
    return;
  }

  // 토큰 검증
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    res.status(403).json({
      success: false,
      message: "유효하지 않거나 만료된 토큰입니다.",
    });
    return;
  }

  // 요청에 사용자 정보 추가
  req.user = decoded;
  next();
};

/**
 * API 키 인증 미들웨어
 * @param req API 요청 객체
 * @param res API 응답 객체
 * @param next 다음 미들웨어 호출 함수
 */
export const authenticateApiKey = async (
  req: ApiKeyRequest,
  res: Response<APIResponse>,
  next: NextFunction,
) => {
  try {
    // 헤더에서 API 키 추출
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      res.status(401).json({
        success: false,
        message: "API 키가 필요합니다.",
      });
      return;
    } else if (!String(apiKey).startsWith("sk-bank-")) {
      res.status(403).json({
        success: false,
        message: "유효하지 않은 API 키입니다.",
      });
      return;
    }

    // API 키 검증
    const apiKeyModel = await ApiKeyModel.findByKey(
      String(apiKey).slice(8),
      mariaDB,
    );
    if (!apiKeyModel || apiKeyModel.status !== "active") {
      res.status(403).json({
        success: false,
        message: "유효하지 않은 API 키입니다.",
      });
      return;
    }

    // 요청에 API 키 정보 추가
    req.apiKey = apiKeyModel;
    next();
  } catch (error) {
    next(error);
  }
};
