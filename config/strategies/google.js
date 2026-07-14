import { Strategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../env.js";

import { findOrCreateOAuthUser } from "../../services/oauth.service.js";

export default new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,

    clientSecret: GOOGLE_CLIENT_SECRET,

    callbackURL: "http://localhost:6002/auth/google/callback",
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser({
        oauthProvider: "google",

        providerId: profile.id,

        email: profile.emails[0].value,

        avatar: profile.photos[0]?.value,

        name: profile.name,

        accessToken: accessToken,

        refreshToken: refreshToken,
      });

      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);
