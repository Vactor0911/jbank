import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { UserController } from "../controllers/user.controller";
import { csrfProtection } from "../middlewares/csrf";

const userRouter = Router();

// 사용자 본인 정보 새로고침
userRouter.patch("/me/refresh", authenticateJWT, UserController.refreshMe);

// 사용자 본인 정보 조회
userRouter.get("/me", authenticateJWT, UserController.me);

// 회원 탈퇴
userRouter.delete(
  "/me",
  authenticateJWT,
  csrfProtection,
  UserController.deleteAccount
);

export default userRouter;
