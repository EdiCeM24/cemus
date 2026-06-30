import asyncHandler from "../utils/asyncHandler.js";
// import { JWT_REFRESH_SECRET_KEY } from "../config/env.js";
import verifyRefreshToken from "../services/auth.service.js";
//

export const refreshTokenHandler = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const refToken = await verifyRefreshToken(refreshToken);
    res.json({ refToken });
  } catch (error) {
    req.flash("error_msg", "Invalid token to process your request: ", error);
  }
});
