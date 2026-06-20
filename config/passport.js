import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { Strategy as FacebookStrategy } from "passport-facebook";

import { Strategy as GitHubStrategy } from "passport-github2";

import User from "../models/User.model.js";

import OAuthAccount from "../models/OauthAccount.model.js";

import { oauthLoginHandler, } from "../services/oauth.service.js";


// SESSION
passport.serializeUser(
  (user, done) => {

    done(null, user.id);
  }
);


passport.deserializeUser(
  async (id, done) => {

    try {

      const user =
        await User.findByPk(id);

      done(null, user);

    } catch (error) {

      done(error, null);
    }
  }
);



// GOOGLE
passport.use(

  new GoogleStrategy(

    {

      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        "/api/auth/google/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

    try {

        const user = await oauthLoginHandler({

            provider: "google",

            providerId: profile.id,

            email:
              profile.emails[0].value,

            name:
              profile.displayName,

            avatar:
              profile.photos[0].value,

            accessToken,

            refreshToken,
          });

        done(null, user);

      } catch (error) {

        done(error, null);
      }
    }
  )
);



// FACEBOOK
passport.use(

  new FacebookStrategy(

    {

      clientID:
        process.env.FACEBOOK_CLIENT_ID,

      clientSecret:
        process.env.FACEBOOK_CLIENT_SECRET,

      callbackURL:
        "/api/auth/facebook/callback",

      profileFields: [
        "id",
        "displayName",
        "emails",
        "photos",
      ],
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      try {

        const user =
          await oauthLoginHandler({

            provider: "facebook",

            providerId: profile.id,

            email:
              profile.emails?.[0]?.value,

            name:
              profile.displayName,

            avatar:
              profile.photos?.[0]?.value,

            accessToken,

            refreshToken,
          });

        done(null, user);

      } catch (error) {

        done(error, null);
      }
    }
  )
);




// GITHUB
passport.use(

  new GitHubStrategy(

    {

      clientID:
        process.env.GITHUB_CLIENT_ID,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET,

      callbackURL:
        "/api/auth/github/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      try {

        const user =
          await oauthLoginHandler({

            provider: "github",

            providerId: profile.id,

            email:
              profile.emails?.[0]?.value,

            name:
              profile.displayName ||
              profile.username,

            avatar:
              profile.photos?.[0]?.value,

            accessToken,

            refreshToken,
          });

        done(null, user);

      } catch (error) {

        done(error, null);
      }
    }
  )
);

export default passport;