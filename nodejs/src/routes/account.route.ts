import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import AccountController from "../controllers/account.controller";

const accountRouter = Router();

// 계좌 목록 조회
accountRouter.get("/", authenticateJWT, AccountController.getAccounts);

export default accountRouter;
