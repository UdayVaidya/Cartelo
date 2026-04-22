import { Router } from "express";
import { loginUser, registerUser, googleCallback } from "../controllers/auth.controller.js";
import passport from "passport";

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
 * @description Google authentication
 * @route GET /api/auth/google
 * @access Public
 */
authRouter
    .get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }))

/**
 * @description Google authentication callback
 * @route GET /api/auth/google/callback
 * @access Public
 */
authRouter
    .get("/google/callback",
        passport.authenticate("google", { failureRedirect: "/login", session: false }),
        googleCallback
    );



export default authRouter;
