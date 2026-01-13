import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { csrfProtection } from "../middlewares/csrf";
import { validateBody } from "../middlewares/validation";
import { createTransferTransactionSchema } from "../schema/transaction.schema";
import TransactionController from "../controllers/transaction.controller";

const transactionRouter = Router();

// 송금 거래 생성
transactionRouter.post(
  "/transfer",
  authenticateJWT,
  csrfProtection,
  validateBody(createTransferTransactionSchema),
  TransactionController.createTransferTransaction
);

export default transactionRouter;
