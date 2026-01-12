import { Response } from "express";
import { APIResponse, AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import AccountService from "../services/account.service";

class AccountController {
  /**
   * 계좌 목록 조회
   */
  static getAccounts = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };

      // 계좌 목록 조회
      const accounts = await AccountService.getAccounts(userId);

      // 응답 전송
      res.json({
        success: true,
        message: "계좌 목록이 조회되었습니다.",
        data: {
          accounts,
        },
      });
    }
  );
}

export default AccountController;
