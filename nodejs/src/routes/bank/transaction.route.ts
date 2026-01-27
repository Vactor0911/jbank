import { Router } from "express";
import { authenticateApiKey } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validation";
import { createBankTransactionSchema } from "../../schema/transaction.schema";
import TransactionController from "../../controllers/bank/transaction.controller";

const transactionRouter = Router();

// 입금 거래 생성
transactionRouter.post(
  "/deposit",
  authenticateApiKey,
  validateBody(createBankTransactionSchema),
  TransactionController.createBankDepositTransaction,
);

// 출금 거래 생성
transactionRouter.post(
  "/withdraw",
  authenticateApiKey,
  validateBody(createBankTransactionSchema),
  TransactionController.createBankWithdrawTransaction,
);

export default transactionRouter;
