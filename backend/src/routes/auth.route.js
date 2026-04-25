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
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a success message.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contact
 *               - fullName
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               contact:
 *                 type: string
 *                 example: "+1234567890"
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: password123
 *               isSeller:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal server error
 */
authRouter.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and sets an HTTP-only cookie with the JWT token.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               contact:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 */
authRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     description: Clears the authentication cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
authRouter.post("/logout", logoutUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the currently authenticated user's details.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       401:
 *         description: Not authenticated or invalid token
 *       404:
 *         description: User not found
 */
authRouter.get("/me", getMe);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth Login
 *     description: Redirects the user to Google for authentication.
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to Google login
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
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     description: Handles the callback from Google after successful authentication.
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to frontend application
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
