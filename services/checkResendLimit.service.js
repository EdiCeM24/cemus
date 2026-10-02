import asyncHandler from "../utils/asyncHandler.js";

export const checkResendLimit = asyncHandler(async (user) => {
  if (user.resendBlockedUntil && user.resendBlockedUntil > new Date()) {
    throw new Error("Too many resend requests.");
  }

  user.resendCount += 1;
  // 5 instead of 3 that was before:
  if (user.resendCount >= 5) {
    user.resendBlockedUntil = new Date(Date.now() + 30 * 60 * 60 * 1000);

    user.resendCount = 0;
  }

  await user.save();
});
