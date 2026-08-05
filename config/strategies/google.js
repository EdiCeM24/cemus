import { Strategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../env.js";
import { findOrCreateOAuthUser } from "../../services/oauth.service.js";
import { registerDevice } from "../../services/device.service.js";

export default new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,

    clientSecret: GOOGLE_CLIENT_SECRET,

    callbackURL: "/auth/google/callback",
    proxy: true,
  },

  async (accessToken, refreshToken, profile, done) => {
    done(null, profile);
    try {
      const user = await findOrCreateOAuthUser({
        oauthProvider: "google",

        providerId: profile.id,

        email: profile.emails[0].value,

        avatar: profile.photos[0]?.value,

        firstName: profile.name.givenName,

        lastName: profile.name.familyName,

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
