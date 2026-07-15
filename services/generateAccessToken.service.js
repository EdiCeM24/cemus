import crypto from "crypto";
import { JWT_SECRET_KEY } from "../config/env.js";
import jwt from "jsonwebtoken";
import secret from "../auth/config.js";

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET_KEY,
    {
      expiresIn: secret.accessTokenExpiresIn,
    },
  );
  return accessToken;
};

export default generateAccessToken;
