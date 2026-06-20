import express from "express";
import { isAuthenticated } from "../middlewares/session.authentication.middleware";
import { isSuperAdmin } from "../middlewares/admin.auth.middleware";
// import { is } from "useragent";

const router = express.Router();

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

router.get("/admin/users", isAuthenticated, isSuperAdmin, (req, res) => {
  res.send("", { message: "Super Admin User Management" });
});
