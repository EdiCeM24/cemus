import crypto from "crypto";

// ADD INSIDE OAUTH CALLBACK
import { registerDevice } from "../services/device.service.js";

import User from "../models/User.model.js";
import OauthAccount from "../models/OauthAccount.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const oauthLoginHandler = asyncHandler(
  async ({
    provider,
    registerDevice,
    providerId,
    email,
    name,
    avatar,
    accessToken,
    refreshToken,
  }) => {
    let oauthAccount = await OauthAccount.findOne({
      where: {
        provider,
        providerId,
      },

      include: User,
    });

    // EXISTING ACCOUNT
    if (oauthAccount) {
      return oauthAccount.User;
    }

    // FIND USER
    let user = await User.findOne({
      where: { email },
    });

    await registerDevice(
      user,

      req.device,

      accessToken,
    );

    // CREATE USER
    if (!user) {
      user = await User.create({
        name,

        email,

        avatar,

        oauthProvider: provider,

        isVerified: true,

        password: crypto.randomBytes(32).toString("hex"),
      });
    }

    // CREATE OAUTH ACCOUNT
    await OAuthAccount.create({
      provider,

      providerId,

      registerDevice,

      accessToken,

      refreshToken,

      UserId: user.id,
    });

    user.lastLogin = new Date();

    return user;
  },
);

// 7. OAuth User Service

// Centralize all provider logic.

// services/oauth.service.js

// import User from "../models/User.model.js";

// export async function findOrCreateOAuthUser({
//   email,
//   provider,
//   providerId,
//   avatar,
//   name,
// }) {
//   let user = await User.findOne({
//     where: { email },
//   });

//   if (!user) {
//     user = await User.create({
//       email,
//       provider,
//       providerId,
//       avatar,
//       name,
//       isEmailVerified: true,
//     });
//   }

//   user.lastLogin = new Date();

//   await user.save();

//   return user;
// }
