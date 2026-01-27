import { Response } from "express";
import { ApiKeyRequest, APIResponse } from "../../types";
import { asyncHandler } from "../../utils/asyncHandler";
import { TransactionService } from "../../services/transaction.service";
import AccountModel from "../../models/account.model";
import { mariaDB } from "../../config/mariadb";
import { NotFoundError } from "../../errors/CustomErrors";
import { UserModel } from "../../models/user.model";

class TransactionController {
  // TODO: 은행 간 거래 서비스 로직 구현 필요

  /**
   * 입금 거래 생성
   */
  static createBankDepositTransaction = asyncHandler(
    async (req: ApiKeyRequest, res: Response<APIResponse>) => {
      const { apiKey } = req;
      const { userSteamId, amount } = req.body;

      // 은행 계좌 정보 조회
      const userId = apiKey?.userId;
      if (!userId) {
        throw new NotFoundError("API 키와 연결된 사용자를 찾을 수 없습니다.");
      }

      const bankAccount = await AccountModel.findByUserId(userId, mariaDB);
      if (!bankAccount || bankAccount.length === 0 || !bankAccount[0]) {
        throw new NotFoundError("송금자 계좌를 찾을 수 없습니다.");
      }
      const bankAccountNumber = bankAccount[0].accountNumber;

      // 사용자 계좌 정보 조회
      const userAccount = await AccountModel.findByUserSteamId(
        userSteamId,
        mariaDB,
      );
      if (!userAccount || userAccount.length === 0 || !userAccount[0]) {
        throw new NotFoundError("수취자 계좌를 찾을 수 없습니다.");
      }
      const userAccountNumber = userAccount[0].accountNumber;

      // 입금 거래 생성
      const transaction = await TransactionService.createTransferTransaction(
        userId,
        bankAccountNumber,
        userAccountNumber,
        amount,
        "0000",
      );

      // 응답 전송
      res.json({
        success: true,
        message: "성공적으로 입금되었습니다.",
        data: {
          transaction,
        },
      });
    },
  );

  /**
   * 출금 거래 생성
   */
  static createBankWithdrawTransaction = asyncHandler(
    async (req: ApiKeyRequest, res: Response<APIResponse>) => {
      const { apiKey } = req;
      const { userSteamId, amount } = req.body;

      // 은행 계좌 정보 조회
      const userId = apiKey?.userId;
      if (!userId) {
        throw new NotFoundError("API 키와 연결된 사용자를 찾을 수 없습니다.");
      }

      const bankAccount = await AccountModel.findByUserId(userId, mariaDB);
      if (!bankAccount || bankAccount.length === 0 || !bankAccount[0]) {
        throw new NotFoundError("송금자 계좌를 찾을 수 없습니다.");
      }
      const bankAccountNumber = bankAccount[0].accountNumber;

      // 사용자 및 사용자 계좌 정보 조회
      const user = await UserModel.findBySteamId(userSteamId, mariaDB);
      if (!user) {
        throw new NotFoundError("수취자를 찾을 수 없습니다.");
      }

      const userAccount = await AccountModel.findByUserSteamId(
        userSteamId,
        mariaDB,
      );
      if (!userAccount || userAccount.length === 0 || !userAccount[0]) {
        throw new NotFoundError("수취자 계좌를 찾을 수 없습니다.");
      }
      const userAccountNumber = userAccount[0].accountNumber;
      console.log(userAccount[0].password, "userAccount password");

      // 출금 거래 생성
      const transaction = await TransactionService.createTransferTransaction(
        user.id,
        userAccountNumber,
        bankAccountNumber,
        amount,
        "0000",
      );

      // 응답 전송
      res.json({
        success: true,
        message: "성공적으로 출금되었습니다.",
        data: {
          transaction,
        },
      });
    },
  );
}

export default TransactionController;
