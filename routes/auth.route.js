import express from "express";
import { signOut, register } from "../controllers/auth.controller.js";
import {
  handleLogin,
  verifyTokenMessage,
  handleSignup,
  verifySuccessMessage,
} from "../controllers/home.controller.js";
import verifyEmail from "../controllers/verifyEmail.controller.js";
import signIn, { user } from "../controllers/authLogin.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import validateUser from "../middlewares/inputValidator.middleware.js";
// import { refreshTokenHandler } from "../controllers/refreshToken.controller.js";
import verifyRefreshToken from "../services/auth.service.js";
import { protects } from "../middlewares/protect.middleware.js";

const authRouter = express.Router();

// GET Routes:

authRouter.get("/sign-up", handleSignup);
// verifyEmail,
authRouter.get("/login", verifyEmail, protects, handleLogin);

authRouter.get("/verify-success", verifyEmail, verifySuccessMessage);

authRouter.get("/verify-email", verifyTokenMessage);

// authRouter.get(
//   "/user",
//   protects,
//   authorize(["user", "super_admin", "admin"]),
//   user,
// );

// POST Routes:

authRouter.post("/refresh-token", verifyRefreshToken); // To use it and verify sign in

authRouter.post("/verify/:token", verifyEmail);

authRouter.post("/register", upload.single("profile"), validateUser, register);

authRouter.post("/sign-in", validateUser, signIn);

// verifyToken
authRouter.post("/logout", signOut);

export default authRouter;
