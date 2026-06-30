import RefreshToken from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from "../config/env.js";

//
const verifyRefreshToken = asyncHandler(async (req, res, token) => {
  try {
    const refreshToken = await RefreshToken.findOne({ where: { token } });

    if (!refreshToken) {
      req.flash("error_msg", "Invalid refresh token");
      return res.redirect("/auth/sign-up");
    }

    const { userId, expiresAt } = refreshToken;
    if (new Date(Date.now()) > expiresAt) {
      await refreshToken.destroy();
      req.flash("error_msg", "Refresh token has expired.");
      return res.redirect("/auth/login");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      req.flash("error_msg", "User not found");

      return res.redirect("/auth/sign-up");
    }

    const accessToken = jwt.sign({ userId }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // hashed Token before save

    await RefreshToken.save();

    req.cookie("accessToken", accessToken, {
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 60 * 1000,
      secure: true,
    });
    req.cookie("refreshToken", refreshToken, {
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
    });

    req.flash("success_msg", "RefreshToken was verified!");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Invalid refreshToken and server error");
    return res.redirect("/auth/sign-up");
  }
});

// RefreshToken Generate function
const generateRefreshToken = asyncHandler(async (userId) => {
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET_KEY, {
    expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  await RefreshToken.create({
    token: refreshToken,
    userId,
    expiresAt: new Date(Date.now() > 3 * 24 * 60 * 60 * 1000),
  });

  return res.json(refreshToken);
});

export default { generateRefreshToken, verifyRefreshToken };
