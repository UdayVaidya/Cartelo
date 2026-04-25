import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

/**
 * HOW MIDDLEWARE WORKS:
 *
 * Every Express middleware receives three arguments:
 *   req  → the incoming request object
 *   res  → the outgoing response object
 *   next → a function to pass control to the next middleware/route
 *
 * Flow:
 *   Request → [verifyJWT] → [routeHandler]
 *                ↓ (if token invalid)
 *             send 401 and STOP
 */
export const verifyJWT = async (req, res, next) => {
    try {
        // 1️⃣  Grab the token — from cookie OR Authorization header
        //     Header format: "Bearer <token>"
        const token =
            req.cookies?.accessToken ||
            req.headers?.authorization?.replace("Bearer ", "");

        if (!token) {
            // Stop the chain — no token means not authenticated
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        // 2️⃣  Verify the token signature & expiry using our secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3️⃣  Find the user in the DB using the ID baked into the token
        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Unauthorized: User not found");
        }

        // 4️⃣  Attach the user to req so any downstream route can use it
        //     e.g. req.user._id, req.user.role, req.user.email
        req.user = user;

        // 5️⃣  Call next() to hand off to the actual route handler
        next();
    } catch (error) {
        // If jwt.verify fails (expired / tampered), it throws — we catch it here
        next(new ApiError(401, error?.message || "Invalid access token"));
    }
};


export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            throw new ApiError(401, "Unauthorized: Invalid token");
            }

            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                throw new ApiError(401, "Unauthorized: User not found");
            }
            if (user.role !== "seller") {
                throw new ApiError(403, "Forbidden: Seller access required");
            }
            req.user = user;
            next();
    } catch (error) {
        next(error);
    }
}

