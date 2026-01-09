import { NextFunction, Request, Response } from "express";
import ApiKeyService from "../services/apikey.service";
import AppError from "../errors/AppError";

// API 키 인증 미들웨어
export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 헤더에서 API 키 추출
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    res.status(401).json({
      success: false,
      message: "API 키가 제공되지 않았습니다.",
    });
    return;
  }

  // API 키 검증
  try {
    await ApiKeyService.validateApiKey(apiKey);
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: (error as AppError).message,
    });
    return;
  }
};
