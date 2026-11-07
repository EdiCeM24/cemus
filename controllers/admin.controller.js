import { Op } from "sequelize";
import User from "../models/User.model.js";
import { paginate } from "../utils/pagination.js";
import { searchQuery } from "../utils/search.js";
// import sendEmail from "../config/sendEmail.js";
import moment from "moment";
import asyncHandler from "../utils/asyncHandler.js";
import Contact from "../models/contact.model.js";
import AboutModel from "../models/AboutModel.js";
import { Sequelize } from "sequelize";

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
  try {
    // 1. Validate if ID exists if this route relies on it
    const userId = req.params.id || req.user?.id;

    if (userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const [
      users,
      totalUsers,
      activeUsers,
      activeNowUsers,
      userDetails,
      contacts,
      totalTransactions,
      messages,
    ] = await Promise.all([
      User.findAll(),
      User.count(),
      User.count({ where: { isActive: true } }),
      User.count({
        where: {
          lastLogin: {
            [Op.gt]: moment().subtract(10, "minutes").toDate(),
          },
        },
      }),
      // Combined the two duplicate findByPk queries into one
      User.findByPk(userId, {
        attributes: [
          "id",
          "firstName",
          "username",
          "lastName",
          "email",
          "profile",
          "avatar",
        ],
      }),
      Contact.findAll({
        attributes: [
          "id",
          [
            Sequelize.fn("to_char", Sequelize.col("date"), "YYYY-MM-DD"),
            "formattedDate",
          ],
        ],
      }),
      Contact.count(),
      AboutModel.findAll({
        attributes: [
          "id",
          [
            Sequelize.fn("to_char", Sequelize.col("date"), "YYYY-MM-DD"),
            "formattedDate",
          ],
        ],
      }),
    ]);

    const transactions = [
      {
        customer: "John Doe",
        status: "Completed",
        job: "Remote",
        date: "2023-06-15",
        amount: 1500,
      },
    ];

    // const page = parseInt(req.query.page) || 1;
    // const keyword = req.query.search || "";

    // const pageNumber = await paginate(
    //   User,
    //   page,
    //   10,
    //   searchQuery(keyword, ["name", "email"]),
    // );

    // const message = await paginate(
    //   Contact,
    //   page,
    //   10,
    //   searchQuery(keyword, ["name", "email", "message"]),
    // );

    // const transactions = [
    //   {
    //     customer: "John Doe",
    //     status: "Completed",
    //     job: "Remote",
    //     date: "2023-06-15",
    //     amount: 1500,
    //   },
    // ];

    res.render("admin/admin", {
      users,
      userDetails,
      // pageNumber,
      // message,
      totalUsers,
      activeUsers,
      activeNowUsers,
      totalTransactions,
      contacts: contacts,
      messages: messages,
      // keyword,
      title: "Admin Page",
      transactions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Page not found or template error",
      error: error.message,
    });
  }
});

const adminBoard = asyncHandler(async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      req.flash("error_msg", "Forbidden!");
      return res.redirect("/api/v1/auth/sign-up");
    }

    const user = await User.findAll();

    const messages = await Contact.findAll();
    // activities
    const activities = await Contact.findOne({
      where: { id: req.messages.id },
    });

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
    const { id } = req.params.id;

    const user = await Contact.findByPk(id);

    if (!user) {
      req.flash("error_msg", "User data not found!");
      return res.redirect("/api/admin/admin");
    } else {
      await Contact.destroy();
    }

    req.flash("success_msg", "User data deleted successfully!");

    return res.redirect("/api/v1/admin/admin");
  } catch (error) {}
});

// UPDATE
const messageHandler = asyncHandler(async (req, res) => {
  try {
    const {} = req.body;

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
  messageHandler,
  admins,
};
