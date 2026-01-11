import { Response } from "express";
import { APIResponse, AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { UserService } from "../services/user.service";

export class UserController {
  /**
   * 사용자 본인 정보 조회
   */
  static me = asyncHandler(
    async (req: AuthRequest, res: Response<APIResponse>) => {
      const { userId } = req.user as { userId: string };

      const user = await UserService.getMe(userId);

      res.json({
        success: true,
        message: "사용자 정보를 성공적으로 조회했습니다.",
        data: {
          user,
        },
      });
    }
  );
}
