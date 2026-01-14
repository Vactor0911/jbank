import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { csrfProtection } from "../middlewares/csrf";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validation";
import {
  createTransferTransactionSchema,
  getAccountTransactionsParamsSchema,
  getAccountTransactionsQuerySchema,
  getTransactionSchema,
} from "../schema/transaction.schema";
import TransactionController from "../controllers/transaction.controller";

const transactionRouter = Router();

// 거래 내역 목록 조회
transactionRouter.get(
  "/account/:accountUuid",
  authenticateJWT,
  validateParams(getAccountTransactionsParamsSchema),
  validateQuery(getAccountTransactionsQuerySchema),
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
