// src/config/rateLimiter.ts
import rateLimit, { Options } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { Request, Response } from "express";
import { RateLimiterOptions, RateLimitError } from "../types/rateLimiter";
import { redisLimiter } from "./redisLimiter";

// 기본 에러 메시지
const defaultMessage: RateLimitError = {
  success: false,
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.",
  },
};

// Rate limiter 생성 함수
export const createRateLimiter = (options: RateLimiterOptions = {}) => {
  const config: Partial<Options> = {
    // Redis Store 설정
    store: new RedisStore({
      // @ts-ignore - rate-limit-redis 타입 이슈
      client: redisLimiter,
      prefix: options.prefix || "rl:",
      sendCommand: (...args: [string, ...string[]]) =>
        redisLimiter.call(...args) as Promise<any>,
    }),

    // 시간 윈도우
    windowMs: options.windowMs || 15 * 60 * 1000,

    // 최대 요청 수
    max: options.max || 100,

    // 응답 메시지
    message: options.message || defaultMessage,

    // 표준 헤더 사용
    standardHeaders: true,

    // 레거시 헤더 비활성화
    legacyHeaders: false,

    // 요청 스킵 조건
    skip: options.skip,

    // 성공한 요청 제외 여부
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,

    // 실패한 요청 제외 여부
    skipFailedRequests: options.skipFailedRequests || false,

    // rate limit 도달 시 핸들러
    handler:
      options.handler ||
      ((req: Request, res: Response): void => {
        res.status(429).json({
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.",
            retryAfter: res.getHeader("RateLimit-Reset"),
          },
        } as RateLimitError);
      }),

    // 요청 카운트 증가 조건
    requestWasSuccessful:
      options.requestWasSuccessful ||
      ((req: Request, res: Response): boolean => {
        return res.statusCode < 400;
      }),
  };

  return rateLimit(config);
};
