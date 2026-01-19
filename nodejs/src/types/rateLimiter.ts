// src/types/rateLimiter.ts
import { Request, Response } from "express";

export interface RateLimiterOptions {
  prefix?: string;
  windowMs?: number;
  max?: number | ((req: Request) => number | Promise<number>);
  message?: string | object;
  keyGenerator?: (req: Request) => string;
  skip?: (req: Request, res: Response) => boolean | Promise<boolean>;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  handler?: (req: Request, res: Response) => void;
  requestWasSuccessful?: (req: Request, res: Response) => boolean;
}

export interface RateLimitError {
  success: false;
  error: {
    code: string;
    message: string;
    retryAfter?: string | number;
  };
}
