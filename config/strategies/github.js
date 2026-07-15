// config/strategies/github.js
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../env.js";
import { Strategy } from "passport-github2";
import { findOrCreateOAuthUser } from "../../services/oauth.service.js";

export default new Strategy(
  {
    clientID: GITHUB_CLIENT_ID,

    clientSecret: GITHUB_CLIENT_SECRET,

    callbackURL: "http:localhost:6002/api/auth/github/callback",
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser({
        oauthProvider: "github",

        providerId: profile.id,

        name: profile.name,

        email: profile.emails?.[0]?.value,

        avatar: profile.photos?.[0]?.value,

        accessToken: accessToken,

        refreshToken: refreshToken,
      });

      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);
