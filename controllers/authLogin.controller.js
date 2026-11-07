import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookieOptions } from "../config/cookies.js";
import RefreshToken from "../models/refreshToken.model.js";
import generateAccessToken from "../services/generateAccessToken.service.js";
import generateRefreshToken from "../services/generateRefreshToken.service.js";
import cleanupExpiredUsers from "../jobs/cleanupExpiredUsers.job.js";

// Route Handler
const signIn = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      req.flash("error", "All fields are required!");
      return res.redirect("/api/v1/auth/login");
    }

    // Email Verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("error", "Invalid email pattern.");
      return res.redirect("/api/v1/auth/login");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      await bcrypt.compare(
        password,
        "$2b$10$FakeHashForTimingAttackPrevention",
      );
      req.flash("error", "Invalid email or password!");
      return res.redirect("/api/v1/auth/login");
    }

    // Account lock check
    if (user.lockUntil && user.lockUntil > new Date()) {
      req.flash("error", "Account locked. Try again later.");
      return res.redirect("/api/v1/auth/login");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        user.failedLoginAttempts = 0;
      }
      await user.save();
      req.flash("error", "Invalid email or password");
      return res.redirect("/api/v1/auth/login");
    }

    // Require verified email
    if (!user.isVerified) {
      const twentyFoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      // user.timestamp
      if (user.createdAt < twentyFoursAgo) {
        await user.destroy();
        req.flash("error", "Verification link expired. Please, sign up again.");
        cleanupExpiredUsers();
        return res.redirect("/api/v1/auth/sign-up");
      }
      req.flash("error", "Please verify your email to login.");
      return res.redirect("/api/v1/auth/login");
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

    await User.update(
      { refreshToken: hashedRefreshToken },
      { where: { id: user.id } },
    );

    await RefreshToken.create({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, cookieOptions.accessToken);
    res.cookie("refreshToken", refreshToken, cookieOptions.refreshToken);

    if (user.role === "admin" || user.role === "super_admin") {
      req.flash("success", "You are logged in successfully! ✅");
      return res.redirect("/api/v1/admin/admin");
    } else {
      req.flash("success", "You are logged in successfully! ✅");
      return res.redirect("/api/v1/homes/home");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error logging you in.");
    return res.redirect("/api/v1/auth/login");
  }
};

export default signIn;

export const user = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.render("home", { user });
  } catch (error) {
    res
      .status(500)
      .render("error", { message: "Internal Server Error: ", error });
  }
};
