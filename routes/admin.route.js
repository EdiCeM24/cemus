import express from "express";
import {
  adminBoard,
  dashboard,
  deleteMessage,
  handleUserDelete,
  admins,
  updateUser,
} from "../controllers/admin.controller.js";
import { authorize, protects } from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../auth/verify.js";

const adminRouter = express.Router();
// authorize("admin"), protects, isAdmin,
adminRouter.get("/dashboard", dashboard);
adminRouter.get("/admin", admins);

// GET ALL USERS
//adminRouter.get('/', )

// POST CREATE STUFF TO THE USERS
//adminRouter.post('/', )

// PUT UPDATE STUFF FOR THE USERS
//adminRouter.put('/', )

adminRouter.get("/:id", authorize, verifyUser, adminBoard);

adminRouter.delete("/user/:id", authorize, isAdmin, handleUserDelete);

adminRouter.delete("/message/:id", authorize, isAdmin, deleteMessage);

adminRouter.put("/users/:id", updateUser);

export default adminRouter;
