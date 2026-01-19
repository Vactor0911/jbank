import { Request } from "express";
import { createRateLimiter } from "../config/rateLimiter";

// IP별 1분에 100회 제한
export const limiter = createRateLimiter({
  prefix: "rateLimiter:ip:",
  windowMs: 60 * 1000, // 1분
  max: 300,
  keyGenerator: (req: Request): string => req.ip || "unknown",
});
