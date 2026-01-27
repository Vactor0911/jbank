import { Router } from "express";
import { authenticateJWT } from "../../middlewares/auth";
import { UserController } from "../../controllers/jwt/user.controller";
import { csrfProtection } from "../../middlewares/csrf";
import { validateParams } from "../../middlewares/validation";
import { getAccountHolderSchema } from "../../schema/user.schema";

const userRouter = Router();

// 예금주 조회
userRouter.get(
  "/account/:accountNumber",
  authenticateJWT,
  validateParams(getAccountHolderSchema),
  UserController.getAccountHolder,
);

// 사용자 본인 정보 새로고침
userRouter.patch("/me/refresh", authenticateJWT, UserController.refreshMe);

// 사용자 본인 정보 조회
userRouter.get("/me", authenticateJWT, UserController.me);

// 회원 탈퇴
userRouter.delete(
  "/me",
  authenticateJWT,
  csrfProtection,
  UserController.deleteAccount,
);

export default userRouter;
