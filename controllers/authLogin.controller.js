import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.model.js";
import { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from "../config/env.js";
import generateAccessToken from "../services/generateRefreshToken.service.js";
import generateRefreshToken from "../services/generateRefreshToken.service.js";
import cleanupExpiredUsers from "../jobs/cleanupExpiredUsers.job.js";

//
const signIn = asyncHandler(async (req, res) => {
  try {
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
      await cleanupExpiredUsers();
      return res.redirect("/api/v1/auth/sign-up");
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    // Generate AccessToken and RefreshTokken
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Access Token
    const tokenId = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: new Date(Date.now() > 15 * 60 * 60 * 1000),
      },
    );

    // Refresh Token
    const refreshId = jwt.sign(
      {
        id: user.id,
      },
      JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: new Date(Date.now() > 3 * 24 * 60 * 60 * 1000),
      },
    );

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await RefreshToken.create({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() > 3 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, tokenId, {
      secure: NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
      maxAge: 15 * 60 * 60 * 1000,
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, refreshId, {
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

export default signIn;
