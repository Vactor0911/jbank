import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import TransactionService from "../services/transaction.service";

class TransactionController {
  /**
   * 거래 내역 조회
   */
  static getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const { accountNumber } = req.params;

    // 거래 내역 조회
    const transactions = await TransactionService.getTransactions(
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
  });
}

export default TransactionController;
