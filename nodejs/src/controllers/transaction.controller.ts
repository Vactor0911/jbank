import { Response } from "express";
import { APIResponse, AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { TransactionService } from "../services/transaction.service";

class TransactionController {
  /**
   * 거래 내역 조회
   */
  static getTransaction = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };
      const { transactionUuid } = req.params;

      // 거래 조회
      const transaction = await TransactionService.getTransaction(
        userId,
        transactionUuid
      );

      // 응답 전송
      res.json({
        success: true,
        message: "거래 내역 조회에 성공했습니다.",
        data: {
          transaction,
        },
      });
    }
  );

  /**
   * 송금 거래 생성
   */
  static createTransferTransaction = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };
      const { senderAccountNumber, receiverAccountNumber, amount, password } =
        req.body;

      // 송금 거래 생성
      const transaction = await TransactionService.createTransferTransaction(
        userId,
        senderAccountNumber,
        receiverAccountNumber,
        amount,
        password
      );

      // 응답 전송
      res.json({
        success: true,
        message: "성공적으로 송금되었습니다.",
        data: {
          transaction,
        },
      });
    }
  );
}

export default TransactionController;
