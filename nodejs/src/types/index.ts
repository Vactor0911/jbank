import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import ApiKeyModel from "../models/apikey.model";

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
  userId: string;
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
 * JWT 방식 인증 요청 인터페이스
 */
export interface JwtRequest extends Request {
  user?: JwtPayload;
}

/**
 * API 키 방식 인증 요청 인터페이스
 */
export interface ApiKeyRequest extends Request {
  apiKey?: ApiKeyModel;
}

/**
 * API 응답 인터페이스
 */
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  accessToken?: string;
  csrfToken?: string;
}
