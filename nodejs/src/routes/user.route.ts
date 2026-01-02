import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validateBody, validateParams } from "../middlewares/validation";
import {
  createUserSchema,
  refreshUserNameSchema,
  searchUserSchema,
} from "../schema/user.schema";
import { validateApiKey } from "../middlewares/authenticate";

const userRouter = Router();

// 사용자 사용자명 재설정
userRouter.get(
  "/:steamId/refresh",
  validateApiKey,
  validateParams(refreshUserNameSchema),
  UserController.refreshUserName
);

// 사용자 검색
userRouter.get(
  "/:keyword",
  validateApiKey,
  validateParams(searchUserSchema),
  UserController.searchUsers
);

// 사용자 생성
userRouter.post(
  "/",
  validateApiKey,
  validateBody(createUserSchema),
  UserController.createUser
);

export default userRouter;
