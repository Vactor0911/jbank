import { Router } from "express";
import { validateApiKey } from "../middlewares/authenticate";
import { validateParams } from "../middlewares/validation";
import {
  getAccountBalanceSchema,
  getAccountTransactionsSchema,
  searchAccountSchema,
} from "../schema/account.schema";
import AccountController from "../controllers/account.controller";

const accountRouter = Router();

// 예금 조회
accountRouter.get(
  "/:accountNumber/balance",
  validateApiKey,
  validateParams(getAccountBalanceSchema),
  AccountController.getAccountBalance
);

// 계좌 거래 내역 조회
accountRouter.get(
  "/:accountNumber",
  validateApiKey,
  validateParams(getAccountTransactionsSchema),
  AccountController.getAccountTransactions
);

// 계좌 조회
accountRouter.get(
  "/:accountNumber",
  validateApiKey,
  validateParams(searchAccountSchema),
  AccountController.searchAccount
);

export default accountRouter;
