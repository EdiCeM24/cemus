import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Op } from "sequelize";
import Contact from "../models/contact.model.js";

export const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password, role } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();
    role = role?.trim();

    if (!email || !password || !role) {
      req.flash("error_msg", "All fields required!");

      return res.redirect("/api/v1/admin/register");
    }

    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { role: "admin" }] },
    });

    if (!user) {
      req.flash("error_msg", "Invalid credentials");

      return res.redirect("/api/v1/auth/sign-up");
    }

    if (req.user.role !== "admin") {
      req.flash("error_msg", "Access denied. Admin only!");
      await user.destroy();
      return res.redirect("/api/v1/auth/sign-up");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      req.flash("error_msg", "Invalid credentials");

      await user.destroy();

      return res.redirect("/api/v1/auth/sign-up");
    }

    req.session.user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    req.flash("success_msg", `You're logged in ${user}  successfully`);

    return res.redirect("/api/v1/admin/dashboard");
  } catch (error) {
    console.log(error);
    req.flash(
      "error_msg",
      "Error logging you in as server error encountered network fault!",
    );

    return res.redirect("/api/v1/auth/login");
  }
});


// secure Cookies:
// cookie: {
  // secure: true,
  // httpOnly: true,
  // sameSite: "lax"
// }

// 5. Session Configuration
// config/session.js

// import session from "express-session";
// import pgSession from "connect-pg-simple";

// const PgStore = pgSession(session);

// export default session({
//   store: new PgStore({
//     conString: process.env.DATABASE_URL,
//   }),

//   secret: process.env.SESSION_SECRET,

//   resave: false,

//   saveUninitialized: false,

//   cookie: {
//     secure: process.env.NODE_ENV === "production",
//     httpOnly: true,
//     sameSite: "lax",
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   },
// });
