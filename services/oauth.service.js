import User from "../models/User.model.js";

export async function findOrCreateOAuthUser({
  providerId,
  oauthProvider,
  firstName,
  lastName,
  email,
  avatar,
}) {
  let user = await User.findOne({
    where: { email },
  });

  if (!user) {
    user = await User.create({
      providerId,
      oauthProvider,
      firstName,
      lastName,
      email,
      avatar,
      isEmailVerified: true,
    });
  }

  user.lastLogin = new Date();

  await user.save();

  return user;
}
