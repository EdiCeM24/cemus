import ejs from "ejs";
import path from "path";
import { AUTH_EMAIL } from "../config/env.js";
import resend from "../config/resend.js";
import asyncHandler from "../utils/asyncHandler.js";

export const sendVerificationEmail = asyncHandler(
  async (email, name, code, verificationLink) => {
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "verify-email.ejs",
    );

    const html = await ejs.renderFile(templatePath, {
      name,
      code,
      verificationLink,
    });

    await resend.emails.send({
      from: AUTH_EMAIL,
      // process.env.EMAIL_FROM,

      to: email,

      subject: "Verify Your Email",

      html,
    });
  },
);
