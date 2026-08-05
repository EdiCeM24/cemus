// config/strategies/facebook.js
import { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID } from "../env.js";
import { Strategy } from "passport-facebook";
import { findOrCreateOAuthUser } from "../../services/oauth.service.js";
import { registerDevice } from "../../services/device.service.js";

export default new Strategy(
  {
    clientID: FACEBOOK_APP_ID,

    clientSecret: FACEBOOK_APP_SECRET,

    callbackURL: "http://localhost:6002/auth/facebook/callback",

    profileFields: [
      "id",
      "emails",
      "firstName",
      "lastName",
      "profile.type(large)",
    ],
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser({
        oauthProvider: "facebook",

        email: profile.emails?.[0]?.value,

        providerId: profile.id,

        avatar: profile.photos?.[0]?.value,

        firstName: profile.name?.givenName,

        lastName: profile.name?.familyName,

        accessToken: accessToken,

        refreshToken: refreshToken,
      });

      await registerDevice(user);
      return done(null, user);
    } catch (err) {
      done(err);
    }
  },
);
