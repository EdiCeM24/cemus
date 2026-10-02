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

const sendEmail = asyncHandler(async ({ html, subject, to, verifyLink }) => {
  // 1. Double check that we actually have the required parameters
  if (!to || !verifyLink) {
    throw new Error("Missing email or verifyLink parameters");
  }

  await transporter.sendMail({
    from: `'Edidiong Portfolio' <p>${AUTH_EMAIL}</p>`,
    to: to,
    subject: subject,
    html: html,
  });
});

export default sendEmail;
