import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// I will test it if it works
export const protects = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Try extracting JWT from Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Fallback: Try extracting JWT from Session/Cookies if using cookie-based JWT sessions
  else if (req.session && req.session.token) {
    token = req.session.token;
  }

  // 3. Fallback: If using standard passport/express sessions without explicit JWTs
  if (!token && req.isAuthenticated && req.isAuthenticated()) {
    return next(); // Passport already populated req.user, skip token validation
  }

  if (!token) {
    req.flash("error_msg", "Please log in to access this page");
    return res.redirect("/api/v1/auth/sign-up");
  }

  try {
    // 4. Verify your JWT
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    // 5. Fetch user from DB and attach to the request lifecycle object
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "admin") {
      req.flash("error_msg", "Access denied. Admins only.");
      return res.redirect("/api/v1/auth/sign-up");
    }

    // Standardize: Populate both req.user and the session cache so your whole app stays in sync
    req.user = user;
    req.session.user = user;

    next();
  } catch (error) {
    req.flash("error_msg", "Session expired. Please log in again.");
    return res.redirect("/api/v1/auth/sign-up");
  }
});

// ...roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        req.flash("error_msg", "User context not found!");
        return res.redirect("/api/v1/auth/login");
      }

      // if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      //   req.flash("error_msg", "Forbidden. Access denied.");
      //   return res.redirect("/api/v1/auth/login");
      // }

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

// Super Admin
const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super_admin") {
    req.flash("error_msg", "Forbidden. Access denied.");
    return res.redirect("/api/v1/auth/login");
  }

  next();
};

export default isSuperAdmin;
