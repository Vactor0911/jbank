import authRouter from "./auth.route";
import userRouter from "./user.route";
import accountRouter from "./account.route";
import transactionRouter from "./transaction.route";
import { Router } from "express";

const webRouter = Router();

webRouter.use("/auth", authRouter);
webRouter.use("/user", userRouter);
webRouter.use("/account", accountRouter);
webRouter.use("/transaction", transactionRouter);

export default webRouter;
