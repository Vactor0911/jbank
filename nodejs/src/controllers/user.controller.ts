import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import UserService from "../services/user.service";
import LogService from "../services/log.service";

class UserController {
  /**
   * 사용자 목록 조회
   */
  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const { steamId, password } = req.body;

    // 사용자 생성
    const userUuid = await UserService.createUser(steamId, password);

    // 로그 기록
    const apiKey = req.headers["x-api-key"] as string;
    await LogService.logUserCreation(apiKey, userUuid);

    // 응답 반환
    res.status(201).json({
      success: true,
      message: "사용자가 성공적으로 생성되었습니다.",
      data: { userUuid },
    });
  });

  /**
   * 사용자 검색
   */
  static searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const { keyword } = req.params;

    // 사용자 검색
    const users = await UserService.searchUsers(keyword);

    // 응답 반환
    res.status(200).json({
      success: true,
      message: "사용자가 성공적으로 검색되었습니다.",
      data: { users },
    });
  });

  /**
   * 사용자명 재설정
   */
  static refreshUserName = asyncHandler(async (req: Request, res: Response) => {
    const { steamId } = req.params;

    // 사용자 사용자명 재설정
    await UserService.refreshUserName(steamId);

    // 로그 기록
    const apiKey = req.headers["x-api-key"] as string;
    await LogService.logUserNameRefresh(apiKey, steamId);

    // 응답 반환
    res.status(200).json({
      success: true,
      message: "사용자 사용자명이 성공적으로 재설정되었습니다.",
    });
  });
}

export default UserController;
