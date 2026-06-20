import express from "express";
import {
  signIn,
  signOut,
  verifyEmail,
  register,
  // refreshToken,
} from "../controllers/auth.controller.js";
import {
  handleLogin,
  verifyTokenMessage,
  handleSignup,
} from "../controllers/home.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";
import passport from "passport";
import validateUser from "../middlewares/inputValidator.middleware.js";

const authRouter = express.Router();

// verifyEmail,
authRouter.get("/sign-up", handleSignup);
// verifyEmail,
authRouter.get("/login", handleLogin);

// I am confused of this below:
authRouter.get("/verify-token/:token", verifyTokenMessage);

authRouter.get("/verify/:token", verifyEmail);

authRouter.post("/register", upload.single("profile"), validateUser, register);

authRouter.post("/sign-in", validateUser, signIn);

authRouter.post("/logout", signOut);

export default authRouter;
