import { Router } from "express";
import { validateApiKey } from "../middlewares/authenticate";
import { validateParams } from "../middlewares/validation";
import TransactionController from "../controllers/transaction.controller";
import { findTransactionSchema } from "../schema/transaction.schema";

const transactionRouter = Router();

// 거래 내역 조회
transactionRouter.get(
  "/:transactionUuid",
  validateApiKey,
  validateParams(findTransactionSchema),
  TransactionController.findTransaction
);

export default transactionRouter;
