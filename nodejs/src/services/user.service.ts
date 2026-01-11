import { mariaDB } from "../config/mariadb";
import { NotFoundError } from "../errors/CustomErrors";
import { UserModel } from "../models/user.model";

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
}
