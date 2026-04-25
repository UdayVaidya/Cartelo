import mongoose from "mongoose";
import userModel from "./src/models/user.model.js";
import { config } from "./src/config/config.js";

async function checkUser() {
    await mongoose.connect(config.MONGODB_URI);
    const users = await userModel.find({});
    console.log("Users:", users.map(u => ({ email: u.email, password: u.password, googleId: u.googleId })));
    process.exit(0);
}

checkUser();
