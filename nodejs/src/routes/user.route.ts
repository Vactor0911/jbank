import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();

// 사용자 본인 정보 조회
userRouter.get("/me", authenticateJWT, UserController.me);

export default userRouter;
