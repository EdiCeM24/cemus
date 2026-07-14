import User from "../models/User.model.js";
import cleanupExpiredUsers from "../jobs/cleanupExpiredUsers.job.js";
import hashToken from "../utils/hashToken.js";
import asyncHandler from "../utils/asyncHandler.js";

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpires: {
        [Op.gt]: new Date(Date.now() > 30 * 60 * 60 * 1000),
      },
    },
  });

  if (!user) {
    req.flash("error_msg", "Invalid or expired token");
    await cleanupExpiredUsers();
    return res.redirect("/api/v1/auth/sign-up");
  }

  user.isVerified = true;

  user.verificationToken = null;
  user.verificationTokenExpires = null;

  await user.save();

  req.flash("success_msg", "Email verified successfully ✅");

  return res.redirect("/api/v1/auth/verify-success");
});

export default verifyEmail;
