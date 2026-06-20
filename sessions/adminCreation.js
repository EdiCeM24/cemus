// Admin Creation By Super Admin

import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createAdmin = asyncHandler(async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: "admin",
  });

  res.redirect("/admin/users");
});



