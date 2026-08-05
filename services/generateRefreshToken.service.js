import crypto from "crypto";

// RefreshToken Generate function
const generateRefreshToken = () => {
  const refreshedToken = crypto.randomBytes(64).toString("hex");

  return refreshedToken;
};

export default generateRefreshToken;
