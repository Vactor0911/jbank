import { mariaDB } from "../config/mariadb";
import { ConflictError, NotFoundError } from "../errors/CustomErrors";
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

    return accounts;
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
}

export default AccountService;
