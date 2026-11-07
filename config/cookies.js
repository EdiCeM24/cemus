import { NODE_ENV } from "./env.js";

export const cookieOptions = {
  accessToken: {
    path: "/",
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 20 * 60 * 1000,
    sameSite: "Strict",
  },
  refreshToken: {
    path: "/",
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "Strict",
  },
};
