import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/products.route.js";
import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { config } from "./config/config.js";
import { ApiError } from "./utils/ApiError.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// Set up Swagger UI
setupSwagger(app);

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products",productRouter);

app.post("/api/health", (req, res) => {
    res.json({ status: 200, message: "OK", timestamp: new Date().toISOString() });
});

// 404 — unknown API route
app.use((req, res, next) => {
    next(new ApiError(404, `Cannot ${req.method} ${req.path}`));
});

// Global error handler — catches ApiError throws and unhandled exceptions
app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    const errors = err?.errors || [];

    console.error(`[${statusCode}] ${message}`, err.stack || "");

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
    });
});

export default app;

