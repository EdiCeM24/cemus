import bcryptSalt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import sendEmail from "../config/sendEmail.js";
import { CLIENT_URL } from "../config/env.js";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import RefreshToken from "../models/refreshToken.model.js";
import hashToken from "../utils/hashToken.js";
import { Op } from "sequelize";
import sequelize from "../database/db.js";

// CONTROLLER FUNCTIONALITIES LOGIC
export const register = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const profile = req.file ? req.file.filename : null;

    let { name, username, email, password } = req.body;

    // SANITIZE INPUTS
    name = name?.trim();
    username = username?.trim();
    email = email?.trim().toLowerCase();

    // VALIDATION
    if (!name || !username || !email || !password || !profile) {
      req.flash("error_msg", "All fields are required!");
      return res.redirect("/api/v1/auth/sign-up");
    }

    console.log("Name: ", profile);
    console.log("Username: ", profile);
    console.log("Email: ", profile);
    console.log("Password: ", profile);
    console.log("Profile Image: ", profile);

    // Email Pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //Email Pattern Check
    if (!emailRegex.test(email)) {
      req.flash("error_msg", "Invalid email");
      return res.redirect("/api/v1/auth/sign-up");
    }
    // Username Pattern
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    // Username Pattern Check
    if (!usernameRegex.test(username)) {
      req.flash(
        "error_msg",
        "Invalid username format, it must be alphanumeric and at least one special character.",
      );
      return res.redirect("/api/v1/auth/sign-up");
    }

    // Strong password pattern
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    // Password Pattern Check
    if (!strongPassword.test(password)) {
      req.flash(
        "error_msg",
        "Password must contain uppercase, lowercase, number and special character",
      );

      return res.redirect("/api/v1/auth/sign-up");
    }
    // Password Length Check
    if (password.length < 8) {
      req.flash("error_msg", "Password must be at least 8 characters");
      return res.redirect("/api/v1/auth/sign-up");
    }

    // Find User Identification
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
        transaction,
      },
    });
    // User Identification Check
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

    req.flash("success_msg", "Registration successful ✅. Check your email.");

    return res.redirect("/api/v1/auth/verify-email");
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    req.flash("error_msg", "Unable to send email");

    return res.redirect("/api/v1/auth/sign-up");
  }
});

export const signOut = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

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
