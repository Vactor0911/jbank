import { mariaDB } from "../config/mariadb";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/CustomErrors";
import AccountModel from "../models/account.model";
import { TransactionModel } from "../models/transaction.model";
import { UserModel } from "../models/user.model";
import TransactionHandler from "../utils/transactionHandler";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class TransactionService {
  /**
   * 송금 거래 생성
   * @param userId 송금자 id
   * @param senderAccountNumber 송금 계좌 번호
   * @param receiverAccountNumber 수취 계좌 번호
   * @param amount 송금 금액
   * @param password 송금 계좌 비밀번호
   * @returns 생성된 거래 정보
   */
  static async createTransferTransaction(
    userId: string,
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
    password: string
  ) {
    const transaction = await TransactionHandler.executeInTransaction(
      mariaDB,
      async (connection) => {
        // 송금액 검증
        if (amount <= 0 || amount > 100000000) {
          throw new BadRequestError("송금액이 올바르지 않습니다.");
        }

        // 계좌 번호 정렬
        const accountNumbers = [
          senderAccountNumber,
          receiverAccountNumber,
        ].sort();

        // 첫 번째 계좌 조회 (쓰기 잠금)
        const account1 = await AccountModel.findByAccountNumberForUpdate(
          accountNumbers[0],
          connection
        );

        // 두 번째 계좌 조회 (쓰기 잠금)
        const account2 = await AccountModel.findByAccountNumberForUpdate(
          accountNumbers[1],
          connection
        );

        // 송금자/수취자 계좌 구분
        const senderAccount =
          account1?.accountNumber === senderAccountNumber ? account1 : account2;
        const receiverAccount =
          account1?.accountNumber === receiverAccountNumber
            ? account1
            : account2;
            
        // 계좌 존재 여부 확인
        if (!senderAccount) {
          throw new NotFoundError("송금 계좌를 찾을 수 없습니다.");
        }
        if (!receiverAccount) {
          throw new NotFoundError("수취 계좌를 찾을 수 없습니다.");
        }

        // 같은 계좌 간 송금 불가
        if (senderAccount.id === receiverAccount.id) {
          throw new UnprocessableEntityError("같은 계좌로 송금할 수 없습니다.");
        }

        // 사용자 조회
        const user = await UserModel.findById(userId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // 송금 계좌 검증
        if (senderAccount.userId !== userId) {
          throw new ForbiddenError("권한이 없습니다.");
        }
        if (senderAccount.status !== "active") {
          throw new UnprocessableEntityError(
            "계좌의 거래가 정지되어 송금할 수 없습니다."
          );
        }
        if (BigInt(senderAccount.credit) < BigInt(amount)) {
          throw new UnprocessableEntityError("계좌의 잔액이 부족합니다.");
        }

        // 송금 계좌 비밀번호 검증
        const isPasswordMatch = await bcrypt.compare(
          password,
          senderAccount.password
        );
        if (!isPasswordMatch) {
          throw new ForbiddenError("계좌의 비밀번호가 일치하지 않습니다.");
        }

        // 수취 계좌 검증
        if (receiverAccount.status !== "active") {
          throw new UnprocessableEntityError("해당 계좌로 송금할 수 없습니다.");
        }

        // 거래 생성
        const transactionUuid = uuidv4();
        await TransactionModel.createTransfer(
          transactionUuid,
          senderAccount.id,
          receiverAccount.id,
          amount,
          connection
        );

        // 계좌 잔액 업데이트
        await AccountModel.withdraw(senderAccount.id, amount, connection);
        await AccountModel.deposit(receiverAccount.id, amount, connection);

        // 거래 데이터 생성
        const transaction = {
          uuid: transactionUuid,
          sender: {
            uuid: senderAccount.uuid,
            accountNumber: senderAccount.accountNumber,
          },
          receiver: {
            uuid: receiverAccount.uuid,
            accountNumber: receiverAccount.accountNumber,
          },
          currencyCode: "CRD",
          amount: amount,
        };

        return transaction;
      }
    );
    return transaction;
  }
}
