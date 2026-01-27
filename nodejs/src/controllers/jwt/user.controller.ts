import { Response } from "express";
import { APIResponse, JwtRequest } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserService } from "../../services/user.service";
import { verifyRefreshToken } from "../../utils/jwt";
import { AuthModel } from "../../models/auth.model";
import { deleteCsrfToken } from "../../middlewares/csrf";
import { redis } from "../../config/redis";

export class UserController {
  /**
   * 사용자 본인 정보 조회
   */
  static me = asyncHandler(
    async (req: JwtRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };

      const user = await UserService.getMe(userId);

      res.json({
        success: true,
        message: "사용자 정보를 성공적으로 조회했습니다.",
        data: {
          user,
        },
      });
    },
  );

  /**
   * 사용자 본인 정보 새로고침
   */
  static refreshMe = asyncHandler(
    async (req: JwtRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };

      const steamProfile = await UserService.refreshMe(userId);
      const userData = {
        steamName: steamProfile.steamID,
        avatar: steamProfile.avatarFull,
      };

      res.json({
        success: true,
        message: "사용자 정보를 성공적으로 새로고침했습니다.",
        data: {
          user: userData,
        },
      });
    },
  );

  /**
   * 회원 탈퇴
   */
  static deleteAccount = asyncHandler(
    async (req: JwtRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };
      const { refreshToken } = req.cookies;

      // 회원 탈퇴 처리
      await UserService.deleteUserAccount(userId);

      // Refresh Token 삭제
      if (refreshToken) {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded) {
          // Refresh Token 삭제
          await AuthModel.deleteRefreshToken(decoded.userId, redis);

          // CSRF 토큰 삭제
          await deleteCsrfToken(decoded.userId);
        }
      }

      // 쿠키 삭제
      res.clearCookie("refreshToken");

      // 응답 전송
      res.json({
        success: true,
        message: "회원 탈퇴되었습니다.",
      });
    },
  );

  /**
   * 예금주 조회
   */
  static getAccountHolder = asyncHandler(
    async (req: JwtRequest, res: Response<APIResponse>) => {
      const { accountNumber } = req.params;

      // 예금주 조회
      const accountHolder = await UserService.getAccountHolder(accountNumber);

      // 응답 전송
      res.json({
        success: true,
        message: "예금주가 조회되었습니다.",
        data: {
          user: accountHolder,
        },
      });
    },
  );
}
