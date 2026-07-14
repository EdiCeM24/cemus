// ADD INSIDE OAUTH CALLBACK
import { registerDevice } from "../services/device.service.js";

import User from "../models/User.model.js";

export async function findOrCreateOAuthUser({
  email,
  oauthProvider,
  providerId,
  avatar,
  name,
}) {
  let user = await User.findOne({
    where: { email },
  });

  if (!user) {
    user = await User.create({
      email,
      oauthProvider,
      providerId,
      avatar,
      name,
      isEmailVerified: true,
    });
  }

  user.lastLogin = new Date();

  await user.save();

  return user;
}
