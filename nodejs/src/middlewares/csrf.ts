import crypto from "crypto";
import { redis } from "../config/redis";
import { parseTimeToSeconds } from "../utils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * CSRF 토큰 생성 및 저장
 * @param userId 사용자 id
 * @returns 생성된 CSRF 토큰
 */
export const generateCsrfToken = async (userId: string) => {
  const token = crypto.randomBytes(32).toString("hex");

  // CSRF 토큰 저장
  await redis.setex(
    `csrfToken:${userId}`,
    parseTimeToSeconds(process.env.CSRF_EXPIRES_IN!),
    token,
  );

  return token;
};

/**
 * CSRF 토큰 검증
 * @param userId 사용자 id
 * @param token CSRF 토큰
 * @returns 검증 결과
 */
export const verifyCsrfToken = async (userId: string, token: string) => {
  const key = `csrfToken:${userId}`;
  const storedToken = await redis.get(key);

  if (!storedToken || storedToken !== token) {
    return false;
  }
  return true;
};

/**
 * CSRF 토큰 삭제
 * @param userId 사용자 id
 */
export const deleteCsrfToken = async (userId: string) => {
  const key = `csrfToken:${userId}`;
  await redis.del(key);
};

/**
 * JWT 토큰에서 사용자 ID 추출
 * @param req 요청 객체
 * @returns 사용자 ID 또는 null
 */
const extractUserIdFromToken = (req: Request): string | null => {
  // Refresh Token에서 먼저 추출 시도
  const refreshToken = req.cookies["refreshToken"];
  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as any;

      return decoded.userId;
    } catch {}
  }

  // Access Token에서 추출 시도
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    return decoded.userId;
  } catch {}

  return null;
};

export const csrfProtection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 상태를 변경하지 않는 요청은 검증 제외
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // JWT에서 사용자 ID 추출
  const userId = extractUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ error: "토큰이 유효하지 않습니다." });
  }

  // 헤더에서 CSRF 토큰 추출
  const csrfToken = req.headers["x-csrf-token"] as string;
  if (!csrfToken) {
    return res.status(403).json({ error: "CSRF 토큰이 필요합니다." });
  }

  // CSRF 토큰 검증
  const isValid = await verifyCsrfToken(userId, csrfToken);
  if (!isValid) {
    return res.status(403).json({ error: "CSRF 토큰이 유효하지 않습니다." });
  }

  next();
};
