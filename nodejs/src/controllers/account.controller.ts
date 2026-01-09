import { Request, Response } from "express";
import AccountService from "../services/account.service";
import { asyncHandler } from "../utils/asyncHandler";
import TransactionService from "../services/transaction.service";

class AccountController {
  /**
   * 계좌 조회
   */
  static searchAccount = asyncHandler(async (req: Request, res: Response) => {
    const { accountNumber } = req.params;

    // 계좌 조회
    const account = await AccountService.findAccountByAccountNumber(
      accountNumber
    );

    // 응답 반환
    res.status(200).json({
      success: true,
      message: "계좌 조회에 성공했습니다.",
      data: {
        account,
      },
    });
  });

  /**
   * 예금 조회
   */
  static getAccountBalance = asyncHandler(
    async (req: Request, res: Response) => {
      const { accountNumber } = req.params;

      // 예금 조회
      const balance = await AccountService.getAccountBalance(accountNumber);

      // 응답 반환
      res.status(200).json({
        success: true,
        message: "예금 조회에 성공했습니다.",
        data: {
          balance,
        },
      });
    }
  );

  /**
   * 거래 내역 조회
   */
  static getAccountTransactions = asyncHandler(
    async (req: Request, res: Response) => {
      const { accountNumber } = req.params;

      // 거래 내역 조회
      const transactions = await TransactionService.getAccountTransactions(
        accountNumber
      );

      // 응답 반환
      res.status(200).json({
        success: true,
        message: "거래 내역 조회에 성공했습니다.",
        data: {
          transactions,
        },
      });
    }
  );
}

export default AccountController;
