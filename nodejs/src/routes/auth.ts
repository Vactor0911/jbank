import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth";
import { csrfProtection } from "../middlewares/csrf";
import { redis } from "../config/redis";

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
authRouter.post(
  "/refresh",
  authenticateJWT,
  csrfProtection,
  AuthController.refreshJwtToken
);

// CSRF 토큰 재발급
authRouter.post(
  "/csrf",
  authenticateJWT,
  AuthController.refreshCsrfToken
)

// 로그아웃
authRouter.post(
  "/logout",
  authenticateJWT,
  csrfProtection,
  AuthController.logout
);

export default authRouter;
