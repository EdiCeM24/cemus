// config/strategies/facebook.js
import { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID } from "../env.js";
import { Strategy } from "passport-facebook";
import { findOrCreateOAuthUser } from "../../services/oauth.service.js";

export default new Strategy(
  {
    clientID: FACEBOOK_APP_ID,

    clientSecret: FACEBOOK_APP_SECRET,

    callbackURL: "http://localhost:6002/auth/facebook/callback",

    profileFields: ["id", "emails", "name", "profile.type(large)"],
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser({
        oauthProvider: "facebook",

        email: profile.emails?.[0]?.value,

        providerId: profile.id,

        avatar: profile.photos?.[0]?.value,

        name: profile.name.name,

        accessToken: accessToken,

        refreshToken: refreshToken,
      });

      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);
