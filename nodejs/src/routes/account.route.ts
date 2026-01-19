import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import AccountController from "../controllers/account.controller";
import { csrfProtection } from "../middlewares/csrf";
import { validateBody, validateParams } from "../middlewares/validation";
import {
  createAccountSchema,
  getAccountSchema,
  getRecentAccountsSchema,
} from "../schema/account.schema";
import { limiter } from "../middlewares/rateLimiter";

const accountRouter = Router();

// 최근 거래 계좌 조회
accountRouter.get(
  "/:accountNumber/recent",
  authenticateJWT,
  limiter,
  validateParams(getRecentAccountsSchema),
  AccountController.getRecentAccounts,
);

// 계좌 정보 조회
accountRouter.get(
  "/:accountUuid",
  authenticateJWT,
  limiter,
  validateParams(getAccountSchema),
  AccountController.getAccount,
);

// 계좌 목록 조회
accountRouter.get("/", authenticateJWT, limiter, AccountController.getAccounts);

// 새 계좌 개설
accountRouter.post(
  "/",
  authenticateJWT,
  csrfProtection,
  limiter,
  validateBody(createAccountSchema),
  AccountController.createAccount,
);

export default accountRouter;
