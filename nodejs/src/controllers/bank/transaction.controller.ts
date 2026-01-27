import { Response } from "express";
import { ApiKeyRequest, APIResponse } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { TransactionService } from "../../services/transaction.service";
import AccountModel from "../../models/account.model";
import { mariaDB } from "../../config/mariadb";
import { NotFoundError } from "../../errors/CustomErrors";

class TransactionController {
  // TODO: 은행 간 거래 서비스 로직 구현 필요

  /**
   * 송금 거래 생성
   */
  static createTransferTransaction = asyncHandler(
    async (req: ApiKeyRequest, res: Response<APIResponse>) => {
      const { apiKey } = req;
      const { receiverSteamId, amount, password } = req.body;

      console.log("Create Transfer Transaction Request:", {
        apiKey,
        receiverSteamId,
        amount,
      });

      // 거래 데이터 추출
      const userId = apiKey?.userId;
      if (!userId) {
        throw new NotFoundError("API 키와 연결된 사용자를 찾을 수 없습니다.");
      }

      const senderAccount = await AccountModel.findByUserId(userId, mariaDB);
      if (!senderAccount || senderAccount.length === 0 || !senderAccount[0]) {
        throw new NotFoundError("송금자 계좌를 찾을 수 없습니다.");
      }
      const senderAccountNumber = senderAccount[0].accountNumber;

      const receiverAccount = await AccountModel.findByUserSteamId(
        receiverSteamId,
        mariaDB,
      );
      if (
        !receiverAccount ||
        receiverAccount.length === 0 ||
        !receiverAccount[0]
      ) {
        throw new NotFoundError("수신자 계좌를 찾을 수 없습니다.");
      }
      const receiverAccountNumber = receiverAccount[0].accountNumber;

      // 송금 거래 생성
      const transaction = await TransactionService.createTransferTransaction(
        userId,
        senderAccountNumber,
        receiverAccountNumber,
        amount,
        password,
      );

      // 응답 전송
      res.json({
        success: true,
        message: "성공적으로 송금되었습니다.",
        data: {
          transaction,
        },
      });
    },
  );
}

export default TransactionController;
