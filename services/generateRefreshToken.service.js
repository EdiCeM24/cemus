import crypto from "crypto";
import { JWT_REFRESH_SECRET_KEY } from "../config/env.js";
import jwt from "jsonwebtoken";

// RefreshToken Generate function
const generateRefreshToken = () => {
  const refreshedToken = crypto.randomBytes(64).toString("hex");
};

// // Refresh Token
// const refreshId = jwt.sign(
//   {
//     id: user.id,
//   },
//   JWT_REFRESH_SECRET_KEY,
//   {
//     expiresIn: "7d",
//   },
// );

export default generateRefreshToken;
