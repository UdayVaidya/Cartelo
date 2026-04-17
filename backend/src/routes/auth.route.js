import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
authRouter.post("/register", registerUser);

/**
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access Public
 */
authRouter.post("/login", loginUser);



export default authRouter;
