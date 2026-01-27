import { Router } from "express";
import { authenticateApiKey } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validation";
import { createBankTransferTransactionSchema } from "../../schema/transaction.schema";
import TransactionController from "../../controllers/bank/transaction.controller";

const transactionRouter = Router();

// 송금 거래 생성
transactionRouter.post(
  "/transfer",
  authenticateApiKey,
  validateBody(createBankTransferTransactionSchema),
  TransactionController.createTransferTransaction,
);

export default transactionRouter;
