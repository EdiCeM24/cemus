// config/strategies/github.js

import { Strategy } from "passport-github2";

export default new Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,

    clientSecret: process.env.GITHUB_CLIENT_SECRET,

    callbackURL: "/api/auth/github/callback",
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser({
        email: profile.emails?.[0]?.value,

        provider: "github",

        providerId: profile.id,

        avatar: profile.photos?.[0]?.value,

        firstName: profile.displayName,
      });

      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);
