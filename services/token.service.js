import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, JWT_EXPIRES_IN } from "../config/env.js";

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

export const sendVerificationEmail = async (email, code, verificationLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Verify Your Email",

    html: `

      <div style="
        font-family: Arial;
        padding: 20px;
      ">

        <h2>Email Verification</h2>

        <p>
          Your verification code is:
        </p>

        <h1>${code}</h1>

        <p>
          This code expires in
          <strong>10 minutes</strong>.
        </p>

        <p>
          Or click the link below:
        </p>

        <a href="${verificationLink}">
          Verify Email
        </a>

        <br /><br />

        <small>
          If this link expires,
          signup again to get
          a new verification code
          and token.
        </small>

      </div>
    `,
  });
};
