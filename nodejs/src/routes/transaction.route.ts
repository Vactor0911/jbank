import { Router } from "express";
import { validateApiKey } from "../middlewares/authenticate";
import { validateParams } from "../middlewares/validation";
import { getTransactionsSchema } from "../schema/transaction.schema";
import TransactionController from "../controllers/transaction.controller";

const transactionRouter = Router();

// 거래 내역 조회
transactionRouter.get(
  "/:accountNumber/transactions",
  validateApiKey,
  validateParams(getTransactionsSchema),
  TransactionController.getTransactions
);

export default transactionRouter;
