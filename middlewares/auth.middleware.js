import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Op } from "sequelize";
import { admins } from "../controllers/admin.controller.js";

// I will test it if it works
export const protects = asyncHandler(async (req, res, next) => {
  const authHeader = req.Headers["authorization"];

  if (!authHeader) {
    req.flash("error_msg", "You are forbidden!");

    return res.redirect("/api/v1/auth/sign-up");
  }

  const token = authHeader.split(" ")[1];
  // req.cookies.token;

  if (!token) {
    req.flash("success", "Unauthorized");
    return res.redirect("/api/v1/auth/login");
  }

  try {
    const userId = req.params.id;
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "Unauthorized!" });

      return res.redirect("/api/v1/auth/login");
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    req.user = decoded.id;

    if (!req.isAuthenticated()) {
      req.flash("error_msg", "My good friend you are not authenticated!");

      return res.redirect("/api/v1/auth/login");
    }
    next();
  } catch (error) {
    req.flash("error_msg", "Unauthorized!");
    return res.redirect("/api/v1/auth/login");
  }
});

export const authorize = (...roles) => {
  return async (req, res, next) => {
    const userId = req.params.id;

    const { role } = req.body;
    // role is undefined
    const userRole = await User.findOne({
      where: { [Op.or]: [{ role }, { role: admins }] },
    });

    const user = await User.findByPk(userId);

    if (!user) {
      req.flash("error_msg", "User not found!");

      return res.redirect("/api/v1/auth/sign-up");
    }

    user.role = userRole;

    if (!roles.includes(req.user.role)) {
      req.flash("error_msg", "Forbidden. Access denied.");
      res.redirect("/api/v1/auth/login");
    }
    next();
  };
};
