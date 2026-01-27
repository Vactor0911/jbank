import { Request } from "express";
import { createRateLimiter } from "../config/rateLimiter";

/**
 * IP별 1분에 200회 제한
 */
export const webLimiter = createRateLimiter({
  prefix: "rateLimiter:ip:",
  windowMs: 60 * 1000, // 1분
  max: 200,
  keyGenerator: (req: Request): string => req.ip || "unknown",
});
