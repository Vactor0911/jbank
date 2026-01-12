import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import AccountController from "../controllers/account.controller";
import { csrfProtection } from "../middlewares/csrf";
import { validateBody } from "../middlewares/validation";
import { createAccountSchema } from "../schema/account.schema";

const accountRouter = Router();

// 계좌 목록 조회
accountRouter.get("/", authenticateJWT, AccountController.getAccounts);

// 새 계좌 개설
accountRouter.post(
  "/",
  authenticateJWT,
  csrfProtection,
  validateBody(createAccountSchema),
  AccountController.createAccount
);

export default accountRouter;
