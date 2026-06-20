import asyncHandler from "../utils/asyncHandler.js";

export const checkResendLimit = asyncHandler(async (user) => {
  if (user.resendBlockedUntil && user.resendBlockedUntil > new Date()) {
    throw new Error("Too many resend requests.");
  }

  user.resendCount += 1;

  if (user.resendCount >= 3) {
    user.resendBlockedUntil = new Date(Date.now() + 30 * 60 * 1000);

    user.resendCount = 0;
  }

  await user.save();
});
