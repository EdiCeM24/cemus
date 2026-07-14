import jwt from "jsonwebtoken";
import {
  JWT_REFRESH_SECRET_KEY,
  JWT_SECRET_KEY,
  JWT_ACCESS_EXPIRES_IN,
} from "../config/env.js";

//
export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
};

//
export const generatedRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET_KEY, {
    expiresIn: new Date(Date.now() > 3 * 24 * 60 * 60 * 1000),
  });
};
