import express from "express";
import {
  adminBoard,
  dashboard,
  deleteMessage,
  handleUserDelete,
  admins,
  messageHandler,
} from "../controllers/admin.controller.js";
import { authorize, protects } from "../middlewares/protect.middleware.js";
import verifyEmail from "../controllers/verifyEmail.controller.js";
import isSuperAdmin from "../middlewares/protect.middleware.js";

const adminRouter = express.Router();
// authorize("admin"), protects, isAdmin,
adminRouter.get(
  "/dashboard",
  // protects,
  // authorize("super_admin", "admin"),
  dashboard,
);

// THE USE ONE
// protects,
// authorize,
// isSuperAdmin,
// verifyEmail,
adminRouter.get(
  "/admin",

  admins,
);

// GET ALL USERS
//adminRouter.get('/', )

// POST CREATE STUFF TO THE USERS
//adminRouter.post('/', )

// PUT UPDATE STUFF FOR THE USERS
//adminRouter.put('/', )

adminRouter.get(
  "/:id",
  authorize("super_admin", "admin"),
  protects,
  verifyEmail,
  adminBoard,
);

adminRouter.delete(
  "/user/:id",
  authorize("super_admin", "admin"),
  protects,

  handleUserDelete,
);

adminRouter.delete(
  "/message/:id",
  authorize("super_admin", "admin"),
  protects,

  deleteMessage,
);

adminRouter.post(
  "/info",
  authorize("super_admin", "admin"),
  protects,
  messageHandler,
);

// POST FOR CLIENT TO CREATE SUGGESTIONS OR HELP
// homeRouter.post('/');

// PUT FOR CLIENT TO UPDATE SUGGESTIONS OR HELP
// homeRouter.put('/');

// DELETE FOR CLIENT TO DELETE THEIR UPDATE SUGGESTIONS OR HELP
// homeRouter.delete('/');

export default adminRouter;
