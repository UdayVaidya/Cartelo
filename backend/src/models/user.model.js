import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      unique: true,
      sparse: true, // allows multiple documents to omit this field entirely
    },
    googleId: {
      type: String,
      default: null,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    password: {
      type: String,
      default: null,
      required: function () {
        return !this.googleId;
      },
    },
    profilePictureURL: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false; // OAuth user has no password
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("userModel", userSchema);
