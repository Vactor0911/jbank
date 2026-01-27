import { Router } from "express";
import passport from "passport";
import { AuthController } from "../../controllers/auth.controller";
import {
  authenticateJWT,
  authenticateRefreshToken,
} from "../../middlewares/auth";
import { csrfProtection } from "../../middlewares/csrf";
import { validateParams } from "../../middlewares/validation";
import { steamTokensSchema } from "../../schema/auth.schema";

const authRouter = Router();

// Steam 로그인 콜백
authRouter.get(
  "/steam/callback",
  passport.authenticate("steam", {
    failureRedirect: `${process.env.FRONTEND_URL}/jbank/login?error=auth_failed`,
    session: false,
  }),
  AuthController.login,
);

// 인증 토큰 교환
authRouter.get(
  "/steam/tokens/:code",
  validateParams(steamTokensSchema),
  AuthController.exchangeTokens,
);

// Steam 로그인
authRouter.get("/steam", passport.authenticate("steam"));

// Refresh Token으로 Access Token 재발급
authRouter.post(
  "/refresh",
  authenticateRefreshToken,
  csrfProtection,
  AuthController.refreshJwtToken,
);

// CSRF 토큰 재발급
authRouter.post(
  "/csrf",
  authenticateRefreshToken,
  AuthController.refreshCsrfToken,
);

// 로그아웃
authRouter.post(
  "/logout",
  authenticateJWT,
  csrfProtection,
  AuthController.logout,
);

export default authRouter;
