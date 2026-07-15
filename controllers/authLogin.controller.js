import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { Op } from "sequelize";
import bcryptSalt from "bcryptjs";
import crypto from "crypto";
import { cookieOptions } from "../config/cookies.js";
import RefreshToken from "../models/refreshToken.model.js";
import generateAccessToken from "../services/generateAccessToken.service.js";
import generateRefreshToken from "../services/generateRefreshToken.service.js";
import cleanupExpiredUsers from "../jobs/cleanupExpiredUsers.job.js";

//
const signIn = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim().toLowerCase();
  password = password?.trim();

  if (!email || !password) {
    req.flash("error_msg", "All fields are required!");
    return res.redirect("/api/v1/auth/login");
  }

  // Email Verification
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    req.flash("error_msg", "Invalid email pattern.");

    return res.redirect("/api/v1/auth/login");
  }

  const user = await User.findOne({ where: { [Op]: [{ email }] } });

  if (!user) {
    await bcryptSalt.compare(
      password,
      "$2b$10$FakeHashForTimingAttackPrevention",
    );
    req.flash("error_msg", "Invalid email or password!");

    return res.redirect("/api/v1/auth/login");
  }

  // Account lock check
  if (user.lockUntil && user.lockUntil > new Date()) {
    req.flash("error_msg", "Account locked. Try again later.");

    return res.redirect("/api/v1/auth/login");
  }

  const validPassword = await bcryptSalt.compare(password, user.password);

  if (!validPassword) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);

      user.failedLoginAttempts = 0;
    }

    await user.save();

    req.flash("error_msg", "Invalid email or password");

    return res.redirect("/api/v1/auth/login");
  }

  // Require verified email
  if (!user.isVerified) {
    const twentyFoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // user.timestamp
    if (user.createdAt < twentyFoursAgo) {
      await user.destroy();
      req.flash(
        "error_msg",
        "Verification link expired. Please, sign up again.",
      );
      return res.redirect("/api/v1/auth/sign-up");
    }

    req.flash("error_msg", "Please verify your email to login in.");
  }

  // Reset Login Restrictions
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  // Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  await User.update({ refreshToken }, { where: { id: user.id } });

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await RefreshToken.create({
    token: hashedRefreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("accessToken", accessToken, cookieOptions);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  req.flash("success_msg", "You are logged in successfully! ✅");

  return res.redirect("/api/v1/homes/home");
});

export default signIn;

//
// FOR LOGIN PRODUCTION FLOW STRUCTURE:
// Validate Request
//       │
//       ▼
// Normalize Input
//       │
//       ▼
// Find User
//       │
//       ▼
// Check Account Status
//       │
//       ▼
// Verify Password
//       │
//       ▼
// Reset/Login Attempts
//       │
//       ▼
// Generate JWTs
//       │
//       ▼
// Store Hashed Refresh Token
//       │
//       ▼
// Set Secure Cookies
//       │
//       ▼
// Audit Log
//       │
//       ▼
// Return Response
