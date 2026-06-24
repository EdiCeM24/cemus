// config/strategies/google.js

import { Strategy } from "passport-google-oauth20";

import { findOrCreateOAuthUser } from "../../services/oauth.service.js";

export default new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,

    clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    callbackURL: "/api/auth/google/callback",
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser({
        email: profile.emails[0].value,

        provider: "google",

        providerId: profile.id,

        avatar: profile.photos[0]?.value,

        firstName: profile.name.givenName,

        lastName: profile.name.familyName,
      });

      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);
