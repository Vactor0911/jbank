import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { csrfProtection } from "../middlewares/csrf";
import { validateBody, validateParams } from "../middlewares/validation";
import {
  createTransferTransactionSchema,
  getAccountTransactionsSchema,
  getTransactionSchema,
} from "../schema/transaction.schema";
import TransactionController from "../controllers/transaction.controller";

const transactionRouter = Router();

// 거래 내역 목록 조회
transactionRouter.get(
  "/account/:accountNumber",
  authenticateJWT,
  validateParams(getAccountTransactionsSchema),
  TransactionController.getAccountTransactions
);

// 거래 내역 조회
transactionRouter.get(
  "/:transactionUuid",
  authenticateJWT,
  validateParams(getTransactionSchema),
  TransactionController.getTransaction
);

// 송금 거래 생성
transactionRouter.post(
  "/transfer",
  authenticateJWT,
  csrfProtection,
  validateBody(createTransferTransactionSchema),
  TransactionController.createTransferTransaction
);

export default transactionRouter;
