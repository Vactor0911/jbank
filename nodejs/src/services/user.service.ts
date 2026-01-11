import { mariaDB } from "../config/mariadb";
import { NotFoundError } from "../errors/CustomErrors";
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
   * @returns 새로고침된 사용자 정보
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
          connection
        );

        return steamProfile;
      }
    );
    return steamProfile;
  }
}
