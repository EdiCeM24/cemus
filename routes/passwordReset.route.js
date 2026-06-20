import express from "express";
import {
  passwordReset,
  passwordResetcomplete,
  passwordResetDone,
  forgotPassword,
  resetPassword,
  forgotPasswordLogic,
} from "../controllers/forgotpassword.controller.js";

const passwordResetRouter = express.Router();

// GET ROUTES
passwordResetRouter.get("/forgot", forgotPasswordLogic);

passwordResetRouter.get("/reset-password", passwordReset);

passwordResetRouter.get("/confirm", passwordResetcomplete);

passwordResetRouter.get("/password-done", passwordResetDone);

// POST ROUTES
passwordResetRouter.post("/forgot-password", forgotPassword);

passwordResetRouter.post("/reset-password/:token", resetPassword);

export default passwordResetRouter;

