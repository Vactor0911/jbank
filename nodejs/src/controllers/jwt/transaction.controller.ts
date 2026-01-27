import { Response } from "express";
import { APIResponse, JwtRequest } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { TransactionService } from "../../services/transaction.service";

class TransactionController {
  /**
   * 계좌 거래 내역 목록 조회
   */
  static getAccountTransactions = asyncHandler(
    async (req: JwtRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };
      const { accountUuid } = req.params;
      const { page = 1, limit = 10 } = req.query as {
        page?: number;
        limit?: number;
      };

      // 계좌 거래 내역 조회
      const transactions = await TransactionService.getAccountTransactions(
        userId,
        accountUuid,
        page,
        limit
      );

      // 응답 전송
      res.json({
        success: true,
        message: "거래 내역 목록 조회에 성공했습니다.",
        data: {
          transactions,
        },
      });
    }
  );

  /**
   * 거래 내역 조회
   */
  static getTransaction = asyncHandler(
    async (req: JwtRequest, res: Response<APIResponse>) => {
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
    async (req: JwtRequest, res: Response<APIResponse>) => {
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
