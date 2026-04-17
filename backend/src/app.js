import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";

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

// Routes
app.use("/api/v1/auth", authRouter);

app.post("/api/v1/health", (req, res) => {
    res.json({ status: 200, message: "OK", timestamp: new Date().toISOString() });
});

export default app;
