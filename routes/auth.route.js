import express from "express";
import { signOut, register } from "../controllers/auth.controller.js";
import {
  handleLogin,
  verifyTokenMessage,
  handleSignup,
  verifySuccessMessage,
} from "../controllers/home.controller.js";
import verifyEmail from "../controllers/verifyEmail.controller.js";
import signIn from "../controllers/authLogin.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";
import validateUser from "../middlewares/inputValidator.middleware.js";
// import { refreshTokenHandler } from "../controllers/refreshToken.controller.js";
import verifyRefreshToken from "../services/auth.service.js";

const authRouter = express.Router();

authRouter.get("/sign-up", handleSignup);
// verifyEmail,
authRouter.get("/login", handleLogin);

authRouter.get("/verify-success", verifySuccessMessage);

authRouter.get("/verify-email", verifyTokenMessage);

authRouter.post("/refresh-token", verifyRefreshToken); // To check with the verifyTokenMessage.

authRouter.post("/verify/:token", verifyEmail);

authRouter.post("/register", upload.single("profile"), validateUser, register);

authRouter.post("/sign-in", validateUser, signIn);

authRouter.post("/logout", signOut);

export default authRouter;
