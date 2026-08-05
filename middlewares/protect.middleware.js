import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// I will test it if it works
export const protects = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.flash("error_msg", "Unauthorize access");
    return res.redirect("/api/v1/auth/login");
  }

  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    req.flash("error_msg", "You are not authorized");
    return res.redirect("/api/v1/auth/login");
  }

  req.user = decoded.id;

  next();
});

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        req.flash("error_msg", "User not found!");

        return res.redirect("/api/v1/auth/login");
      }

      if (!roles.includes(req.user.role)) {
        req.flash("error_msg", "Forbidden. Access denied.");
        return res.redirect("/api/v1/auth/login");
      }
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error: ", error });
    }
  };
};
