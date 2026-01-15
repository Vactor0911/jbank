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

  /**
   * 계좌 정보 조회
   */
  static getAccount = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };
      const { accountUuid } = req.params;

      // 계좌 정보 조회
      const account = await AccountService.getAccount(userId, accountUuid);

      // 응답 전송
      res.json({
        success: true,
        message: "계좌 정보가 조회되었습니다.",
        data: {
          account,
        },
      });
    }
  );

  /**
   * 새 계좌 개설
   */
  static createAccount = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };
      const { password } = req.body;

      // 새 계좌 개설
      const newAccount = await AccountService.createAccount(userId, password);

      // 응답 전송
      res.json({
        success: true,
        message: "새 계좌가 개설되었습니다.",
        data: {
          account: newAccount,
        },
      });
    }
  );

  /**
   * 최근 거래 계좌 조회
   */
  static getRecentAccounts = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };
      const { accountNumber } = req.params;

      // 최근 거래 계좌 조회
      const recentAccountNumbers = await AccountService.getRecentAccounts(
        userId,
        accountNumber
      );

      // 응답 전송
      res.json({
        success: true,
        message: "최근 거래 계좌 목록이 조회되었습니다.",
        data: {
          recentAccountNumbers,
        },
      });
    }
  );
}

export default AccountController;
