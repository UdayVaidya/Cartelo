import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { config } from "./config/config.js";

const app = express();

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

app.post("/api/health", (req, res) => {
    res.json({ status: 200, message: "OK", timestamp: new Date().toISOString() });
});

export default app;
