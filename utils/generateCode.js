import flash from "connect-flash";
import express from "express";
import User from "../models/User.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const app = express();
app.use(flash());

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default generateCode;

// user was removed from the callback fn
export const generateAccessToken = async (userId) => {
  try {
    const rawToken = crypto.randomBytes(32).toString("hex");

    if (!userId) {
      throw new Error("User ID is required!");
    }

    const user = await User.findByPk(userId);

    if (!userId) {
      throw new Error("User noy found!");
    }

    return jwt.sign({ Id: user.id, role: user.id }, rawToken, {
      expiresIn: "30m",
    });
  } catch (error) {
    console.log(error);
    throw new Error("No access token");
  }
};

// user was removed from the callback fn
export const generateRefreshToken = async (userId) => {
  try {
    const refreshRawToken = crypto.randomBytes(32).toString("hex");

    if (!userId) {
      throw new Error("User ID is required!");
    }

    const user = await User.findByPk(userId);

    if (!userId) {
      throw new Error("User noy found!");
    }

    return jwt.sign({ Id: user.id, role: user.id }, rawToken, {
      expiresIn: "30m",
    });
  } catch (error) {
    console.log(error);
    throw new Error("No refresh token");
  }
};

// Real OTP code for production generation using postgresql
const otp = Math.floor(100000 + Math.random() * 900000).toString();

const hashedOTP = hashToken(otp);

user.verificationCode = hashedOTP;

user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

// Real way to verify OTP for Postgresql
const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    req.flash("error_msg", "Invalid verification request");
    return res.redirect("/api/v1/auth/sign-up");
  }

  const hashedCode = hashToken(code);

  if (
    hashedCode !== user.verificationCode ||
    user.verificationCodeExpires < new Date()
  ) {
    req.flash("error_msg", "Invalid or expired code");

    return res.redirect("/api/v1/auth/verify-code");
  }

  user.isVerified = true;

  user.verificationCode = null;
  user.verificationCodeExpires = null;

  await user.save();

  req.flash("success_msg", "Verification successful");

  return res.redirect("/api/v1/auth/login");
});
