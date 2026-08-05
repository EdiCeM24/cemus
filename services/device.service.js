// Multi Device Login Tracking Service
import asyncHandler from "../utils/asyncHandler.js";
import LoginDevice from "../models/loginDevice.model.js";
// import logger from "../utils/logger.js";

export const registerDevice = asyncHandler(
  async (user, device, refreshToken) => {
    // Validate input data
    if (!user || !device || !refreshToken) {
      throw new Error("error_msg", "Invalid input data");
    }

    // Hash the refreshToken
    const hashedRefreshToken = hashToken(refreshToken);

    // Create a new device registration
    const deviceRegistration = await LoginDevice.create({
      userId: user.id,
      deviceId: device.deviceId,
      browser: device.browser,
      os: device.os,
      ipAdress: device.ipAddress,
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // log the device registration
    console.log(`Device registered: ${device.deviceId} for user ${user.id}`);

    return deviceRegistration;
  },
);

// MULTI DEVICE TRACKING DURING OAUTH
