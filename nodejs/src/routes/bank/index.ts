import { Router } from "express";
import { webLimiter } from "../../middlewares/rateLimiter";
import transactionRouter from "./transaction.route";

const bankRouter = Router();

bankRouter.use("/transaction", webLimiter, transactionRouter);

export default bankRouter;
