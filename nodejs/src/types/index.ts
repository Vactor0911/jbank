import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

/**
 * 사용자 데이터 인터페이스
 */
export interface UserData {
  id?: string;
  uuid: string;
  steamId: string;
  steamName: string;
  avatar: string;
  createdAt?: Date;
  lastLogin?: Date;
}

/**
 * JWT Access Token 페이로드 인터페이스
 */
export interface AccessTokenPayload {
  userId: string;
  userUuid: string;
  userSteamId: string;
  userSteamName: string;
}

/**
 * JWT Refresh Token 페이로드 인터페이스
 */
export interface RefreshTokenPayload {
  userUuid: string;
}

/**
 * Steam 프로필 인터페이스
 */
export interface SteamProfile {
  provider: string;
  id: string;
  displayName: string;
  photos: Array<{ value: string }>;
  _json: {
    steamid: string;
    personaname: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
  };
}

/**
 * API 인증 요청 인터페이스
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * API 응답 인터페이스
 */
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  accessToken?: string;
}
