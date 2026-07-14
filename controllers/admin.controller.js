import User from "../models/User.model.js";

import { paginate } from "../utils/pagination.js";
import { searchQuery } from "../utils/search.js";
import sendEmail from "../config/sendEmail.js";
import asyncHandler from "../utils/asyncHandler.js";

const dashboard = asyncHandler(async (req, res) => {
  res.render("admin/index", { title: "Dashboard Page" }, (err, ejs) => {
    if (err) {
      return res.status(500).json({
        message: "Page not found or template error",
        error: err.message,
      });
    }
    res.send(ejs);
  });
});

const admins = asyncHandler(async (req, res) => {
  res.render("admin/admin", { user: "", title: "Admin Page" }, (err, ejs) => {
    if (err) {
      return res.status(500).json({
        message: "Page not found or template error",
        error: err.message,
      });
    }
    res.send(ejs);
  });
});

const adminBoard = asyncHandler(async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      req.flash("error_msg", "Forbidden!");
      return res.redirect("/api/v1/auth/sign-up");
    }

    const user = await User.findAll();

    const messages = await Contact.findAll();

    const page = parseInt(req.query.page) || 1;
    const keyword = req.query.search || "";

    const users = await paginate(
      User,
      page,
      10,
      searchQuery(keyword, ["name", "email"]),
    );

    const message = await paginate(
      Contact,
      page,
      10,
      searchQuery(keyword, ["name", "email", "message"]),
    );

    res.render("/dashboard", { user, users, message, messages, keyword });
  } catch (error) {
    return res.status(400).json({ message: "Error loading page: ", error });
  }
});

// DELETE USER
const handleUserDelete = asyncHandler(async (req, res) => {
  try {
    const userId = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      req.flash("error_msg", "User not found!");

      return res.redirect("/api/"); // dashboard
    }

    if (user) {
      await User.destroy();

      req.flash("success_msg", "User deleted successfully ✅");
    }

    return res.redirect("/dashboard");
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error in deleting a user! ", error });
  }
});

// DELETE CONTACT MESSAGE
const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Contact.findByPk(id);

    if (!user) {
      req.flash("error_msg", "User data not found!");
      return res.redirect("/api/admin/");
    } else {
      await Contact.destroy();
    }

    req.flash("success_msg", "User data deleted successfully!");

    return res.redirect("/api/");
  } catch (error) {}
});

// UPDATE
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const userId = await User.findByPk(id);

    const { role } = req.body;

    const user = await User.update({ role }, { where: { userId } });

    await user.save();

    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export {
  adminBoard,
  handleUserDelete,
  deleteMessage,
  dashboard,
  updateUser,
  admins,
};
