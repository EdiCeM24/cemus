import crypto from "crypto";

const hashToken = (hashedToken) => {
  return crypto.createHash("sha256").update(hashedToken).digest("hex");
};

export default hashToken;
