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
  verifySuccessMessage,
} from "../controllers/home.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";
import passport from "passport";
import validateUser from "../middlewares/inputValidator.middleware.js";
import { refreshTokenHandler } from "../controllers/refreshToken.controller.js";

const authRouter = express.Router();

authRouter.get("/sign-up", handleSignup);
// verifyEmail,
authRouter.get("/login", handleLogin);

authRouter.get("/verify-success", verifySuccessMessage);

authRouter.get("/verify-token", verifyTokenMessage);

authRouter.post("/refresh-token", refreshTokenHandler); // To check with the verifyTokenMessage.

authRouter.post("/verify/:token", verifyEmail);

authRouter.post("/register", upload.single("profile"), validateUser, register);

authRouter.post("/sign-in", validateUser, signIn);

authRouter.post("/logout", signOut);

export default authRouter;
