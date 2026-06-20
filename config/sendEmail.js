import nodemailer from "nodemailer";
import { AUTH_EMAIL, AUTH_PASS } from "./env.js";
import asyncHandler from "../utils/asyncHandler.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
});

const sendEmail = asyncHandler(
  async ({ email, verifyLink, to, subject, html }) => {
    await transporter.sendMail({
      from: "edidiong-portfolio-website",
      to: email,
      subject: "Verify your Account",
      html: `
      <p>Click the link below to verify your email:</p>

      <a href="${verifyLink}">Verify Account</a>
    `,
    });
  },
);

export default sendEmail;
