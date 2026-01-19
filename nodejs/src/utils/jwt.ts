import jwt, { SignOptions } from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload, UserData } from "../types";
import { BadRequestError } from "../errors/CustomErrors";

/**
 * JWT Access Token 생성
 * @param user 사용자 데이터
 * @returns 생성된 JWT Access Token
 */
export const generateAccessToken = (user: UserData): string => {
  // 사용자 데이터 검증
  if (!user.id) {
    throw new BadRequestError("사용자 ID가 필요합니다.");
  }

  // JWT 페이로드 생성
  const payload: AccessTokenPayload = {
    userId: user.id!,
    userUuid: user.uuid,
    userSteamId: user.steamId,
    userSteamName: user.steamName,
  };

  // 서명 옵션 설정
  const options: SignOptions = {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };

  // 액세스 토큰 생성
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, options);
};

/**
 * JWT Refresh Token 생성
 * @param user 사용자 데이터
 * @returns 생성된 JWT Refresh Token
 */
export const generateRefreshToken = (user: UserData): string => {
  if (!user.id) {
    throw new Error("사용자 ID가 필요합니다.");
  }

  // JWT 페이로드 생성
  const payload: RefreshTokenPayload = {
    userId: user.id,
    userUuid: user.uuid,
  };

  // 서명 옵션 설정
  const options: SignOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  // 리프레시 토큰 생성
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, options);
};

/**
 * JWT Access Token 검증
 * @param token 검증할 JWT Access Token
 * @returns 검증된 페이로드 또는 null
 */
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as AccessTokenPayload;
  } catch {
    return null;
  }
};

/**
 * JWT Refresh Token 검증
 * @param token 검증할 JWT Refresh Token
 * @returns 검증된 페이로드 또는 null
 */
export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as RefreshTokenPayload;
  } catch {
    return null;
  }
};
