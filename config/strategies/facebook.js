// config/strategies/facebook.js

import { Strategy } from "passport-facebook";

export default new Strategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,

    clientSecret: process.env.FACEBOOK_APP_SECRET,

    callbackURL: "/api/auth/facebook/callback",

    profileFields: ["id", "emails", "name", "picture.type(large)"],
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser({
        email: profile.emails?.[0]?.value,

        provider: "facebook",

        providerId: profile.id,

        avatar: profile.photos?.[0]?.value,

        firstName: profile.name.givenName,

        lastName: profile.name.familyName,
      });

      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);
