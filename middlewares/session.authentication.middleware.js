import asyncHandler from "../utils/asyncHandler";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (!req.session.user) {
    req.flash("error_msg", "You are not yet authenticated.");

    return res.redirect("/api/v1/auth/login");
  }

  next();
});
