import crypto from "crypto";
import { JWT_SECRET_KEY } from "../config/env.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Access Token
const tokenId = jwt.sign(
  {
    id: user.id,
    role: user.role,
  },
  JWT_SECRET_KEY,
  {
    expiresIn: "15m",
  },
);
