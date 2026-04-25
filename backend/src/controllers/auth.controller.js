import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { ApiError } from "../utils/ApiError.js";


const TOKEN_COOKIE_NAME = "token";
const TOKEN_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
const TOKEN_COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  path: "/",
};

const signAuthToken = (user) =>
  jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

const setTokenCookie = (res, token, sameSite = "strict") => {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    ...TOKEN_COOKIE_BASE_OPTIONS,
    sameSite,
    maxAge: TOKEN_COOKIE_MAX_AGE,
  });
};

const clearTokenCookie = (res) => {
  res.clearCookie(TOKEN_COOKIE_NAME, TOKEN_COOKIE_BASE_OPTIONS);
};

export const getMe = async (req, res) => {
  try {
    const token = req.cookies?.[TOKEN_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullName: user.fullName,
        role: user.role,
        profilePictureURL: user.profilePictureURL,
      },
    });
  } catch (error) {
    clearTokenCookie(res);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
    });
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Error logging out"));
  }
};

async function sentTokenResponse(user, res, message, statusCode = 200) {
  const token = signAuthToken(user);
  setTokenCookie(res, token, "strict");

  res.status(statusCode).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

export const registerUser = async (req, res, next) => {
  const { email, contact, fullName, password, isSeller } = req.body;

  try {
    if (!email || !contact || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await userModel.create({
      email: email.toLowerCase(),
      contact: contact,
      fullName: fullName,
      password: password,
      role: isSeller ? "seller" : "buyer",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully. Please login.",
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Error creating user"));
  }
};

export const loginUser = async (req, res, next) => {
  const { email, contact, password } = req.body;

  try {
    if ((!email && !contact) || !password) {
      return res
        .status(400)
        .json({ message: "Email/contact and password are required" });
    }

    const queryConditions = [];
    if (email) queryConditions.push({ email: email.toLowerCase() });
    if (contact) queryConditions.push({ contact });

    if (queryConditions.length === 0) {
      return res.status(400).json({ message: "Email or contact is required" });
    }

    const user = await userModel.findOne({ $or: queryConditions });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    await sentTokenResponse(user, res, "User logged in successfully", 200);
  } catch (error) {
    return next(new ApiError(500, error.message || "Error logging in user"));
  }
};

export const googleCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      clearTokenCookie(res);
      return res.redirect(`${config.CORS_ORIGIN}/?error=google_auth_failed`);
    }

    const { id, displayName, emails, photos } = req.user;
    const email = emails?.[0]?.value;
    const profilePic = photos?.[0]?.value;

    if (!email) {
      clearTokenCookie(res);
      return res.redirect(`${config.CORS_ORIGIN}/?error=google_auth_failed`);
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        googleId: id,
        fullName: displayName,
        profilePictureURL: profilePic,
      });
    } else {
      user.googleId = user.googleId || id;
      user.profilePictureURL = profilePic || user.profilePictureURL;
      user.fullName = user.fullName || displayName;
      await user.save();
    }

    const token = signAuthToken(user);
    setTokenCookie(res, token, "lax");

    res.redirect(`${config.CORS_ORIGIN}/`);
  } catch (error) {
    return next(new ApiError(500, error.message || "Error logging in with Google"));
  }
};

export const googleAuthFailure = (req, res) => {
  clearTokenCookie(res);
  res.redirect(`${config.CORS_ORIGIN}/?error=google_auth_failed`);
};
