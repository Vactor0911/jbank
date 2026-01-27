import authRouter from "./auth.route";
import userRouter from "./user.route";
import accountRouter from "./account.route";
import transactionRouter from "./transaction.route";
import { Router } from "express";
import { webLimiter } from "../../middlewares/rateLimiter";

const webRouter = Router();

webRouter.use("/auth", webLimiter, authRouter);
webRouter.use("/user", webLimiter, userRouter);
webRouter.use("/account", webLimiter, accountRouter);
webRouter.use("/transaction", webLimiter, transactionRouter);

export default webRouter;
