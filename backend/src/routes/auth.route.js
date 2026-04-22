import { Router } from "express";
import {
  loginUser,
  registerUser,
  googleCallback,
  getMe,
  logoutUser,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router();

/**
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
authRouter.post("/register", registerUser);

/**
 * @description Login a user
 * @route POST /api/auth/login
 * @access Public
 */
authRouter.post("/login", loginUser);

/**
 * @description Logout a user
 * @route POST /api/auth/logout
 * @access Private
 */
authRouter.post("/logout", logoutUser);

/**
 * @description Get the currently authenticated user
 * @route GET /api/auth/me
 * @access Private (requires token cookie)
 */
authRouter.get("/me", getMe);

/**
 * @description Google authentication
 * @route GET /api/auth/google
 * @access Public
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "consent", // Force the permission screen to show every time
  }),
);

/**
 * @description Google authentication callback
 * @route GET /api/auth/google/callback
 * @access Public
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      config.NODE_ENV === "development" ? `${config.CORS_ORIGIN}/?error=google_auth_failed` : `/?error=google_auth_failed`,
    session: false,
  }),
  googleCallback,
);

export default authRouter;
