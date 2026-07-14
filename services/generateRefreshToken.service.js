import { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from "../config/env.js";
import RefreshToken from "../models/refreshToken.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const generateAccessToken = asyncHandler(async (user) => {
  return jwt.sign({ id: user.id, rele: user.id }, JWT_SECRET_KEY, {
    expiresIn: new Date(Date.now() > 15 * 60 * 60 * 1000),
  });
});

// RefreshToken Generate function
const generateRefreshToken = asyncHandler(async (user) => {
  const refreshToken = jwt.sign({ userId: user }, JWT_REFRESH_SECRET_KEY, {
    expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  await RefreshToken.create({
    token: refreshToken,
    userId: user,
    expiresAt: new Date(Date.now() > 3 * 24 * 60 * 60 * 1000),
  });

  return res.json(refreshToken);
});

export default generateRefreshToken;
