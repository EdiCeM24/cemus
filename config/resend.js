import { Resend } from "resend";
import dotenv from "dotenv";
import { TERMII_API_KEY } from "./env.js";

dotenv.config();

const resend = new Resend(
  TERMII_API_KEY,
  // process.env.RESEND_API_KEY
);

export default resend;