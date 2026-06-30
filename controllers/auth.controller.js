import bcryptSalt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import sendEmail from "../config/sendEmail.js";
import {
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  JWT_EXPIRES_IN,
  NODE_ENV,
  CLIENT_URL,
} from "../config/env.js";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import RefreshToken from "../models/refreshToken.model.js";
import hashToken from "../utils/hashToken.js";
import { Op } from "sequelize";
import cleanupExpiredUsers from "../jobs/cleanupExpiredUsers.job.js";
import sequelize from "../database/db.js";
// import generateRefreshToken from "./refreshToken.controller.js";

// CONTROLLER FUNCTIONALITIES LOGIC
export const register = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    let { name, username, email, password } = req.body;

    let profile = req.file?.filename || null;

    // SANITIZE INPUTS
    name = name?.trim();
    username = username?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    profile = profile?.trim().toString();

    // VALIDATION
    if (!name || !username || !email || !password || !profile) {
      req.flash("error_msg", "All fields are required!");
      return res.redirect("/api/v1/auth/sign-up");
    }

    // Email Verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      req.flash("error_msg", "Invalid email");
      return res.redirect("/api/v1/auth/sign-up");
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

    if (!usernameRegex.test(username)) {
      req.flash(
        "error_msg",
        "Invalid username format, it must be alphanumeric and at least one special character.",
      );
      return res.redirect("/api/v1/auth/sign-up");
    }

    // Strong password validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (!strongPassword.test(password)) {
      req.flash(
        "error_msg",
        "Password must contain uppercase, lowercase, number and special character",
      );

      return res.redirect("/api/v1/auth/sign-up");
    }

    if (password.length < 8) {
      req.flash("error_msg", "Password must be at least 8 characters");
      return res.redirect("/api/v1/auth/sign-up");
    }

    // const existingUser = await User.findOne({ where: { email } });
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (user) {
      req.flash("error_msg", "User already exists");
      return res.redirect("/api/v1/auth/sign-up");
    }

    // Generate verification token
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = hashToken(rawToken);

    const verificationTokenExpires = new Date(Date.now() + 20 * 60 * 1000);

    const salt = await bcryptSalt.genSalt(12);
    const hashed = await bcryptSalt.hash(password, salt);

    const newUser = await User.create(
      {
        name,
        username,
        email,
        password: hashed,
        profile: profile,
        verificationToken: hashedToken,
        verificationTokenExpires,
        isVerified: false,
        role: "user",
      },
      {
        transaction,
      },
    );

    // ✅ Create verification link
    // const verifyLink = `http://localhost:5080/api/v1/autconst rawToken = crypto.randomBytes(32).toString("hex");h/verify-email?token=${hashedToken}`;

    const verifyLink = `${CLIENT_URL}/api/v1/auth/verify-email/${rawToken}`;

    try {
      // Needs to review the mail message why not send.
      await sendEmail({
        to: newUser.email,
        subject: "Verify Email",
        html: `
          <h2>Email Verification</h2>
          <p>Click below to verify your account:</p>
          <a href="${verifyLink}">Verify Email</a>
        `,
      });

      await transaction.commit();
    } catch (err) {
      console.log(err);
      if (newUser) {
        await newUser.destroy();
      }
      req.flash("error_msg", "Error Sending verification link to your email.");
      return res.redirect("/api/v1/auth/sign-up");
    }

    req.flash("success_msg", "Registration successful. Check your email.");

    return res.redirect("/api/v1/auth/verify-email");
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    req.flash("error_msg", "Unable to send email");

    return res.redirect("/api/v1/auth/sign-up");
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpires: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (!user) {
    req.flash("error_msg", "Invalid or expired token");
    await cleanupExpiredUsers();
    return res.redirect("/api/v1/auth/sign-up");
  }

  user.isVerified = true;

  user.verificationToken = null;
  user.verificationTokenExpires = null;

  await user.save();

  req.flash("success_msg", "Email verified successfully ✅");

  return res.redirect("/api/v1/auth/verify-success");
});

export const signIn = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

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
      await user.destroy();

      return res.redirect("/api/v1/auth/login");
    }

    // Strong password validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (!strongPassword.test(password)) {
      req.flash(
        "error_msg",
        "Password must contain uppercase, lowercase, number and special character",
      );

      return res.redirect("/api/v1/auth/login");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      req.flash("error_msg", "Invalid email or password!");
      await user.destroy();
      return res.redirect("/api/v1/auth/login");
    }

    // Account lock check
    if (user.lockUntil && user.lockUntil > new Date()) {
      req.flash("error_msg", "Account locked. Try again later.");
      await user.destroy();
      return res.redirect("/api/v1/auth/sign-up");
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

      await user.destroy();
      return res.redirect("/api/v1/auth/login");
    }

    // Require verified email
    if (!user.isVerified) {
      req.flash("error_msg", "Please verify your email first");

      return res.redirect("/api/v1/auth/sign-up");
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    // Generate RefreshTokken
    // const generatedRefreshToken = await generateRefreshToken(user);

    // Access Token
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await RefreshToken.create({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
      secure: NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
    });

    req.flash("success_msg", "You are logged in successfully! ✅");

    return res.redirect("/api/v1/homes/home");
  } catch (error) {
    console.log("error from here", error);
    req.flash("error_msg", "Error logging you in");
    return res.redirect("/api/v1/auth/sign-up");
  }
});

export const signOut = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const hashed = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      await RefreshToken.destroy({
        where: { token: hashed },
      });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    req.flash("success_msg", "You' re logged out successfully! ✅");
    return res.redirect("/api/v1/auth/login");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Server error");
    return res.redirect("/api/v1/auth/login");
  }
});
