import { mariaDB } from "../config/mariadb";
import { NotFoundError } from "../errors/CustomErrors";
import AccountModel from "../models/account.model";
import { UserModel } from "../models/user.model";
import { fetchSteamProfile } from "../utils/steam";
import TransactionHandler from "../utils/transactionHandler";

export class UserService {
  /**
   * 사용자 본인 정보 조회
   * @param userId 사용자 id
   * @returns 사용자 정보
   */
  static async getMe(userId: string) {
    // 사용자 조회
    const user = await UserModel.findById(userId, mariaDB);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // id 필드 제거
    delete (user as any).id;

    // 사용자 정보 반환
    return user;
  }

  /**
   * 사용자 본인 정보 새로고침
   * @param userId 사용자 id
   * @returns 새로고침된 스팀 프로필
   */
  static async refreshMe(userId: string) {
    const steamProfile = await TransactionHandler.executeInTransaction(
      mariaDB,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findById(userId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // 사용자 정보 새로고침
        const steamProfile = await fetchSteamProfile(user.steamId);
        if (!steamProfile) {
          throw new NotFoundError("스팀 프로필을 찾을 수 없습니다.");
        }

        // 사용자 정보 업데이트
        await UserModel.updateSteamInfo(
          userId,
          steamProfile.steamID,
          steamProfile.avatarFull,
          connection,
        );

        return steamProfile;
      },
    );
    return steamProfile;
  }

  /**
   * 로그인 시 자동 프로필 새로고침 (마지막 새로고침이 1일 이상 경과한 경우)
   * @param userId 사용자 id
   * @returns 새로고침된 스팀 프로필 또는 null
   */
  static async autoRefreshProfile(userId: string) {
    const steamProfile = await TransactionHandler.executeInTransaction(
      mariaDB,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findById(userId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // 마지막 프로필 새로고침 일자 확인
        const lastProfileRefresh = user.lastProfileRefresh;
        const now = new Date();
        const diffInHours =
          (now.getTime() - lastProfileRefresh.getTime()) / (1000 * 60 * 60);
        if (diffInHours < 24) {
          // 1일 이내에 새로고침한 경우, 새로고침하지 않음
          return null;
        }

        // 사용자 정보 새로고침
        const steamProfile = await fetchSteamProfile(user.steamId);
        if (!steamProfile) {
          throw new NotFoundError("스팀 프로필을 찾을 수 없습니다.");
        }

        // 사용자 정보 업데이트
        await UserModel.updateSteamInfo(
          userId,
          steamProfile.steamID,
          steamProfile.avatarFull,
          connection,
        );

        return steamProfile;
      },
    );
    return steamProfile;
  }

  /**
   * 사용자 id로 회원 탈퇴 처리
   * @param userId 사용자 id
   * @returns 탈퇴 처리 결과
   */
  static async deleteUserAccount(userId: string) {
    const result = await TransactionHandler.executeInTransaction(
      mariaDB,
      async (connection) => {
        // 사용자 조회
        const user = await UserModel.findById(userId, connection);
        if (!user) {
          throw new NotFoundError("사용자를 찾을 수 없습니다.");
        }

        // 사용자 삭제
        const result = await UserModel.deleteById(userId, connection);
        return result;
      },
    );
    return result;
  }

  /**
   * 예금주 조회
   * @param accountNumber 계좌번호
   * @returns 예금주 정보
   */
  static async getAccountHolder(accountNumber: string) {
    // 중앙 은행 계좌는 조회 불가
    if (accountNumber === "0000-0000") {
      throw new NotFoundError("해당 계좌번호의 예금주를 찾을 수 없습니다.");
    }

    const account = await AccountModel.findByAccountNumber(
      accountNumber,
      mariaDB,
    );
    if (!account) {
      throw new NotFoundError("계좌를 찾을 수 없습니다.");
    }

    const accountHolder = await UserModel.findByAccountNumber(
      accountNumber,
      mariaDB,
    );
    if (!accountHolder) {
      throw new NotFoundError("해당 계좌번호의 예금주를 찾을 수 없습니다.");
    }

    // id 필드 제거
    delete (accountHolder as any).id;

    // 예금주 정보 반환
    return accountHolder;
  }
}
