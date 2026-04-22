import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { ApiError } from "../utils/ApiError.js";



async function sentTokenResponse(user, res, message,statusCode=200) {
    const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
    )

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role
        }
    })
}

export const registerUser = async (req, res) => {
    const { email, contact, fullName, password, isSeller } = req.body;

    try {
        if (!email || !contact || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await userModel.findOne({ $or: [{ email }, { contact }] })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const createdUser = await userModel.create({
            email: email.toLowerCase(),
            contact: contact,
            fullName: fullName,
            password: password,
            role: isSeller ? "seller" : "buyer"
        })

        res.status(201).json({
            success: true,
            message: "User created successfully. Please login.",
        });
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Error creating user");
    }
}

export const loginUser = async (req, res) => {
    const { email, contact, password } = req.body;
        
    try {

        if ((!email && !contact) || !password) {
            return res.status(400).json({ message: "Email/contact and password are required" })
        }

        const user = await userModel.findOne({ $or: [{ email }, { contact }] })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" })
        }

        await sentTokenResponse(user, res, "User logged in successfully")
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Error logging in user");
    }
} 

export const googleCallback = async (req, res) => {
    try {
        console.log(req.user); 

        const token = jwt.sign(
            { id: req.user._id },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
        console.log(error);
        res.redirect("http://localhost:5173/login?error=google_auth_failed");
    }
}