import bcryptSalt from "bcryptjs";
import { cookieOptions } from "../config/cookies.js";
import User from "../models/User.model.js";
import sendEmail from "../config/sendEmail.js";
import { CLIENT_URL } from "../config/env.js";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import RefreshToken from "../models/refreshToken.model.js";
import hashToken from "../utils/hashToken.js";
import { Op } from "sequelize";
import sequelize from "../database/db.js";
import redis from "redis";

// Redis Implentation
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

// CONTROLLER FUNCTIONALITIES LOGIC
export const register = asyncHandler(async (req, res) => {
  // 1. Safe File Check
  if (!req.file) {
    req.flash("error_msg", "Profile image is required!");
    return res.redirect("/api/v1/auth/sign-up");
  }

  const profile = req.file.filename;
  // const filePath = req.file.path; // Keep track for cleanup
  let { firstName, lastName, username, email, password } = req.body;

  // 2. Sanitize Inputs Safely
  firstName = firstName?.trim();
  lastName = lastName?.trim();
  username = username?.trim().toLowerCase();
  email = email?.trim().toLowerCase();

  // 3. VALIDATION
  if (!firstName || !lastName || !username || !email || !password || !profile) {
    req.flash("error_msg", "All fields are required!");
    return res.redirect("/api/v1/auth/sign-up");
  }

  // Email Pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //Email Pattern Check
  if (!emailRegex.test(email)) {
    // await safeDeleteFile(filePath);
    req.flash("error_msg", "Invalid email");
    return res.redirect("/api/v1/auth/sign-up");
  }

  // Username Pattern
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

  // Username Pattern Check
  if (!usernameRegex.test(username)) {
    // await safeDeleteFile(filePath);
    req.flash(
      "error_msg",
      "Username must contain only letters, numbers and underscores and be between 3 and 30 characters.",
    );
    return res.redirect("/api/v1/auth/sign-up");
  }

  // Strong password pattern
  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Password Pattern Check
  if (!strongPassword.test(password)) {
    // await safeDeleteFile(filePath);
    req.flash(
      "error_msg",
      "Username must contain only letters, numbers and underscores and be between 3 and 30 characters.",
    );

    return res.redirect("/api/v1/auth/sign-up");
  }
  // Password Length Check
  if (password.length < 8) {
    req.flash("error_msg", "Password must be at least 8 characters.");
    return res.redirect("/api/v1/auth/sign-up");
  }

  // 4. Database transaction
  const transaction = await sequelize.transaction();
  try {
    // Find User Identification
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
      transaction,
    });

    // User Identification Check
    if (user) {
      await transaction.rollback();
      // await safeDeleteFile(filePath);
      req.flash("error_msg", "Email or username already exists");
      return res.redirect("/api/v1/auth/sign-up");
    }

    // Generate verification token
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = hashToken(rawToken);

    const verificationTokenExpires = new Date(Date.now() + 20 * 60 * 1000);

    const salt = await bcryptSalt.genSalt(12);
    const hashedPassword = await bcryptSalt.hash(password, salt);

    const newUser = await User.create(
      {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        profile: profile,
        verificationToken: hashedToken,
        verificationTokenExpires,
        isVerified: false,
        role: "user",
        loginAttempts: 0,
      },
      {
        transaction,
      },
    );

    // ✅ Create verification link
    const verifyLink = `${CLIENT_URL}/api/v1/auth/verify-email/${rawToken}`;

    // Needs to review the mail message why not send.
    await sendEmail({
      to: newUser.email,
      subject: "Verify Email",
      html: `
          <h2 class="">Email Verification</h2>
          
          <strong>This link expires in 20 minutes.</strong>

          <a href="${verifyLink}">Verify Email</a>
        `,
    });

    await transaction.commit();

    req.flash("success_msg", "Registration successful. check your email. ✅");
    return res.redirect("/api/v1/auth/verify-email");
  } catch (error) {
    // Ensure transaction rolls back safely if still active
    if (!transaction.finished) {
      await transaction.rollback();
      await newUser.destroy({ transaction }); // To check this
    }

    // Clean up uploaded file on system failure
    // await safeDeleteFile(filePath);

    console.error("Registration Error: ", error);
    req.flash("error_msg", "An unexpected error occurred. Please try again.");
    return res.redirect("/api/v1/auth/sign-up");
  }
});

// Helper function to prevent crashing on file system deletions
// async function safeDeleteFile(filePath) {
//   try {
//     if (filePath) await fs.unlink(filePath);
//   } catch (err) {
//     console.error(`Failed to delete orphaned file: ${filePath}`, err);
//   }
// }

export const signOut = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await redisClient.set(
    `revoked:${jwt.decode(token).jti}`,
    "revoked",
    "EX",
    3600,
  );

  if (refreshToken) {
    await RefreshToken.destroy({
      where: {
        token: hashToken(refreshToken),
      },
    });
  }

  res.clearCookie("accessToken", cookieOptions.accessToken);
  res.clearCookie("refreshToken", cookieOptions.refreshToken);

  req.flash("success_msg", "You have been logged out successfully.");

  return res.redirect("/api/v1/auth/login");
});
