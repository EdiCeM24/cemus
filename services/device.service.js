// Multi Device Login Tracking Service
import asyncHandler from "../utils/asyncHandler.js";
import LoginDevice from "../models/loginDevice.model.js";

export const registerDevice = asyncHandler(
  async (user, device, refreshToken) => {
    await LoginDevice.create({
      UserId: user.id,

      deviceId: device.deviceId,

      browser: device.browser,

      os: device.os,

      ipAddress: device.ipAddress,

      refreshToken,
    });
  },
);

// MULTI DEVICE TRACKING DURING OAUTH

