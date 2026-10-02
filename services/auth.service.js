import RefreshToken from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import { JWT_ACCESS_EXPIRES_IN, JWT_SECRET_KEY } from "../config/env.js";
import { cookieOptions } from "../config/cookies.js";

//
const verifyRefreshToken = asyncHandler(async (req, res, token) => {
  try {
    const refreshToken = await RefreshToken.findOne({
      where: { token: req.body.token },
    });

    if (!refreshToken) {
      req.flash("error_msg", "Invalid refresh token");
      return res.redirect("/api/v1/auth/login");
    }

    const { userId, expiresAt } = refreshToken;
    if (new Date(Date.now()) > expiresAt) {
      await refreshToken.destroy();
      req.flash("error_msg", "Refresh token has expired.");
      return res.redirect("/api/v1/auth/login");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      req.flash("error_msg", "User not found");

      return res.redirect("/api/v1/auth/login");
    }

    const accessToken = jwt.sign({ userId }, JWT_SECRET_KEY, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });

    // hashed Token before save
    const hashedRefreshToken = hashToken(refreshToken);

    await RefreshToken.create({
      refreshToken: hashedRefreshToken,
      expiresAt,
      userId,
    });

    res.cookie("accessToken", accessToken, cookieOptions.accessToken);
    res.cookie("refreshToken", refreshToken, cookieOptions.refreshToken);

    req.flash("success_msg", "RefreshToken was verified!");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Internal server error");
    return res.redirect("/api/v1/auth/sign-up");
  }
});

export default verifyRefreshToken;
