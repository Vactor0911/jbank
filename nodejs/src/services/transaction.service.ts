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
   * 계좌 거래 내역 목록 조회
   * @param userId 사용자 id
   * @param accountUuid 계좌 uuid
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   * @returns 거래 내역 목록
   */
  static async getAccountTransactions(
    userId: string,
    accountUuid: string,
    page: number,
    limit: number,
  ) {
    // 사용자 조회
    const user = await UserModel.findById(userId, mariaDB);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 계좌 조회
    const account = await AccountModel.findByUuid(accountUuid, mariaDB);
    if (!account) {
      throw new NotFoundError("계좌를 찾을 수 없습니다.");
    }

    // 계좌 소유자 확인
    if (account.userId !== user.id) {
      throw new ForbiddenError(
        "해당 계좌의 거래 내역을 조회할 권한이 없습니다.",
      );
    }

    // 거래 내역 조회
    const transactions = await TransactionModel.findByAccountId(
      account.id,
      page,
      limit,
      mariaDB,
    );

    // 거래 내역 데이터 생성
    const formattedTransactions = [];
    for (const transaction of transactions) {
      if (!transaction) {
        continue;
      }

      const formattedTransaction = await this.formatTransaction(transaction);
      formattedTransactions.push(formattedTransaction);
    }

    // 거래 내역 반환
    return formattedTransactions;
  }

  /**
   * 거래 내역 조회
   * @param userId 사용자 id
   * @param transactionUuid 거래 uuid
   * @returns 거래 내역
   */
  static async getTransaction(userId: string, transactionUuid: string) {
    // 사용자 조회
    const user = await UserModel.findById(userId, mariaDB);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 거래 내역 조회
    const transaction = await TransactionModel.findByUuid(
      transactionUuid,
      mariaDB,
    );
    if (!transaction) {
      throw new NotFoundError("거래 내역을 찾을 수 없습니다.");
    }

    // 거래 내역의 송금자 혹은 수취자가 사용자인지 확인
    if (
      transaction.senderAccountHolderUuid !== user.uuid &&
      transaction.receiverAccountHolderUuid !== user.uuid
    ) {
      throw new ForbiddenError("거래 내역을 확인 할 권한이 없습니다.");
    }

    // 거래 내역 데이터 생성
    const formattedTransaction = await this.formatTransaction(transaction);

    // 거래 내역 반환
    return formattedTransaction;
  }

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
    password: string,
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
          connection,
        );

        // 두 번째 계좌 조회 (쓰기 잠금)
        const account2 = await AccountModel.findByAccountNumberForUpdate(
          accountNumbers[1],
          connection,
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
        const receiver = await UserModel.findById(
          receiverAccount.userId,
          connection,
        );
        if (!receiver) {
          throw new NotFoundError("수취 계좌의 사용자를 찾을 수 없습니다.");
        }

        // 송금 계좌 검증
        if (senderAccount.userId !== userId) {
          throw new ForbiddenError("거래 권한이 없습니다.");
        }
        if (senderAccount.status !== "active") {
          throw new UnprocessableEntityError(
            "계좌의 거래가 정지되어 송금할 수 없습니다.",
          );
        }
        if (BigInt(senderAccount.credit) < BigInt(amount)) {
          throw new UnprocessableEntityError("계좌의 잔액이 부족합니다.");
        }

        // 송금 계좌 비밀번호 검증
        const isPasswordMatch = await bcrypt.compare(
          password,
          senderAccount.password,
        );
        // 비밀번호 불일치 검증 (중앙 은행 계좌가 아닐 경우에만)
        if (
          senderAccount.id !== "0" &&
          receiverAccount.id !== "0" &&
          !isPasswordMatch
        ) {
          throw new ForbiddenError("계좌의 비밀번호가 일치하지 않습니다.");
        }

        // 수취 계좌 검증
        if (receiverAccount.status !== "active") {
          throw new UnprocessableEntityError("해당 계좌로 송금할 수 없습니다.");
        }

        // 계좌 잔액 업데이트
        await AccountModel.withdraw(senderAccount.id, amount, connection);
        await AccountModel.deposit(receiverAccount.id, amount, connection);

        // 거래 후 잔액 조회
        const updatedSenderAccount = await AccountModel.findById(
          senderAccount.id,
          connection,
        );
        if (!updatedSenderAccount) {
          throw new NotFoundError("송금 계좌를 찾을 수 없습니다.");
        }
        const senderCurrentBalance = updatedSenderAccount.credit;

        const updatedReceiverAccount = await AccountModel.findById(
          receiverAccount.id,
          connection,
        );
        if (!updatedReceiverAccount) {
          throw new NotFoundError("수취 계좌를 찾을 수 없습니다.");
        }
        const receiverCurrentBalance = updatedReceiverAccount.credit;

        // 거래 생성
        const transactionUuid = uuidv4();
        await TransactionModel.createTransfer(
          transactionUuid,
          senderAccount.id,
          receiverAccount.id,
          amount,
          senderCurrentBalance,
          receiverCurrentBalance,
          connection,
        );

        // 거래 데이터 생성
        const transaction = {
          uuid: transactionUuid,
          sender: {
            uuid: senderAccount.uuid,
            steamName: user.steamName,
            accountNumber: senderAccount.accountNumber,
          },
          receiver: {
            uuid: receiverAccount.uuid,
            steamName: receiver.steamName,
            accountNumber: receiverAccount.accountNumber,
          },
          currencyCode: "CRD",
          amount: amount,
        };

        // 거래 내역 반환
        return transaction;
      },
    );
    return transaction;
  }

  static async formatTransaction(transaction: TransactionModel) {
    // 거래 내역 데이터 생성
    const transactionData = {
      uuid: transaction.uuid,
      sender: {
        uuid: transaction.senderAccountHolderUuid,
        steamName: transaction.senderAccountHolderName,
        accountNumber: transaction.senderAccountNumber,
      },
      receiver: {
        uuid: transaction.receiverAccountHolderUuid,
        steamName: transaction.receiverAccountHolderName,
        accountNumber: transaction.receiverAccountNumber,
      },
      currencyCode: transaction.currencyCode || "CRD",
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    };

    return transactionData;
  }
}
