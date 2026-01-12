import { mariaDB } from "../config/mariadb";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors/CustomErrors";
import AccountModel from "../models/account.model";
import { UserModel } from "../models/user.model";
import { generateAccountNumber } from "../utils";
import TransactionHandler from "../utils/transactionHandler";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

class AccountService {
  /**
   * 사용자 계좌 목록 조회
   * @param userId 사용자 id
   * @returns 계좌 목록
   */
  static async getAccounts(userId: string) {
    // 사용자 조회
    const user = await UserModel.findById(userId, mariaDB);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 계좌 목록 조회
    const accounts = await AccountModel.findByUserId(userId, mariaDB);

    // 계좌 정보 반환
    const formattedAccounts = accounts.map((account: AccountModel) =>
      this.formatAccountData(account)
    );
    return formattedAccounts;
  }

  /**
   * 사용자 계좌 정보 조회
   * @param userId 사용자 id
   * @param accountUuid 계좌 uuid
   * @returns 계좌 정보
   */
  static async getAccount(userId: string, accountUuid: string) {
    // 사용자 조회
    const user = await UserModel.findById(userId, mariaDB);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 계좌 정보 조회
    const account = await AccountModel.findByUuid(accountUuid, mariaDB);
    if (!account) {
      throw new NotFoundError("계좌를 찾을 수 없습니다.");
    }

    console.log("account in service >>", account);

    // 계좌 소유자 확인
    if (account.userId !== userId) {
      throw new ForbiddenError("해당 계좌에 접근할 권한이 없습니다.");
    }

    // 계좌 정보 반환
    const formattedAccount = await this.formatAccountData(account);
    return formattedAccount;
  }

  /**
   * 새 계좌 개설
   * @param userId 사용자 id
   * @param password 계좌 비밀번호
   */
  static async createAccount(userId: string, password: string) {
    await TransactionHandler.executeInTransaction(
      mariaDB,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findById(userId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // 기존 계좌 조회
        const existingAccounts = await AccountModel.findByUserId(
          userId,
          connection
        );
        if (existingAccounts.length > 0) {
          throw new ConflictError("이미 계좌가 개설되어 있습니다.");
        }

        // 새 계좌 생성
        const accountUuid = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        for (let attempt = 0; attempt < 1000; attempt++) {
          try {
            const newAccountNumber = generateAccountNumber();
            await AccountModel.create(
              accountUuid,
              userId,
              newAccountNumber,
              hashedPassword,
              connection
            );
            break; // 성공하면 루프 종료
          } catch (error: any) {
            // MariaDB unique 제약 조건 위반 에러 코드: ER_DUP_ENTRY (1062)
            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
              // 중복된 계좌번호가 생성된 경우 재시도
              continue;
            }
            // 다른 에러인 경우 반복 중단
            break;
          }
        }
      }
    );
  }

  static async formatAccountData(account: AccountModel) {
    return {
      uuid: account.uuid,
      accountNumber: account.accountNumber,
      status: account.status,
      credit: account.credit,
      createdAt: account.createdAt,
    };
  }
}

export default AccountService;
