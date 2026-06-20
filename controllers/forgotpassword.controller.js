import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { CLIENT_URL } from "../config/env.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import hashToken from "../utils/hashToken.js";
import sendEmail from "../config/sendEmail.js";

//================ FORGOT PASSWORD GET Requests LOGICs ========================--//
export const forgotPasswordLogic = asyncHandler(async (req, res) => {
  res.render(
    "forgot-password",
    { title: "Edidiong's Forgot Password Page" },
    (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    },
  );
});

export const passwordReset = asyncHandler(async (req, res) => {
  res.render(
    "passwordReset",
    { title: "Edidiong's Forgot Password Page" },
    (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    },
  );
});

export const passwordResetcomplete = async (req, res) => {
  res.render(
    "password-reset-sent",
    { title: "Edidiong's Forgot Password Page" },
    (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    },
  );
};

export const passwordResetDone = async (req, res) => {
  res.render(
    "password-reset-sent",
    { title: "Edidiong's Forgot Password Page" },
    (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    },
  );
};

//================ FORGOT PASSWORD POST Requests LOGICs ========================--//

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    req.flash("error_msg", "Email is required");

    return res.redirect("/api/v1/passwords/forgot");
  }

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  /**
   * Prevent email enumeration attacks
   * Always return same message
   */
  if (!user) {
    req.flash(
      "success_msg",
      "If the email exists, a reset link has been sent.",
    );

    return res.redirect("/api/v1/auth/forgot-password");
    return res.redirect("/api/v1/passwords/reset-password"); // Needs to be cross check again.
  }

  // Generate raw token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving
  const hashedToken = hashToken(rawToken);

  user.resetPasswordToken = hashedToken;

  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  // Create reset link
  const resetLink = `${CLIENT_URL}/api/v1/passwords/reset-password/${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>

        <p>You requested to reset your password.</p>

        <p>
          Click below to continue:
        </p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>
          This link expires in 15 minutes.
        </p>

        <p>
          If you did not request this,
          please ignore this email.
        </p>
      `,
    });

    req.flash(
      "success_msg",
      "If the email exists, a reset link has been sent.",
    );

    return res.redirect("/api/v1/passwords/reset-password");
  } catch (error) {
    // Cleanup on email failure
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    req.flash("error_msg", "Unable to send reset email");

    return res.redirect("/api/v1/passwords/forgot");
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    req.flash("error_msg", "All fields are required");

    return res.redirect("/api/v1/passwords/reset-password");
  }

  if (password !== confirmPassword) {
    req.flash("error_msg", "Passwords do not match");

    return res.redirect("/api/v1/passwords/reset-password");
  }

  // Strong password validation
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

  if (!strongPassword.test(password)) {
    req.flash(
      "error_msg",
      "Password must contain uppercase, lowercase, number and special character",
    );

    return res.redirect("/api/v1/passwords/reset-password");
  }

  // Hash incoming token
  const hashedToken = hashToken(token);

  // Find valid token
  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (!user) {
    req.flash("error_msg", "Invalid or expired reset token");

    return res.redirect("/api/v1/passwords/forgot");
  }

  // Salt password
  const salt = await bcrypt.genSalt(12);
  // Hash new password
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update password
  user.password = hashedPassword;

  // Clear reset fields
  user.resetPasswordToken = null;

  user.resetPasswordExpires = null;

  user.passwordChangedAt = new Date();

  // Optional:
  // reset login attempts
  user.failedLoginAttempts = 0;

  user.lockUntil = null;

  await user.save();

  /**
   * OPTIONAL:
   * Revoke refresh tokens
   */

  await RefreshToken.destroy({
    where: {
      userId: user.id,
    },
  });

  req.flash("success_msg", "Password reset successful. Please login.");

  return res.redirect("/api/v1/auth/login");
});
