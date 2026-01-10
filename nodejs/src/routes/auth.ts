import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth";

const authRouter = Router();

// Steam 로그인
authRouter.get("/steam", passport.authenticate("steam"));

// Steam 로그인 콜백
authRouter.get(
  "/steam/callback",
  passport.authenticate("steam", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    session: false,
  }),
  AuthController.login
);

// Refresh Token으로 Access Token 재발급
authRouter.post("/refresh", authenticateToken, AuthController.refreshToken);

// 로그아웃
authRouter.post("/logout", authenticateToken, AuthController.logout);

export default authRouter;
