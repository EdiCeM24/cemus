import passport from "passport";
import User from "../models/User.model.js";
import googleStrategy from "./strategies/google.js";
import githubStrategy from "./strategies/github.js";
import facebookStrategy from "./strategies/facebook.js";

passport.use(googleStrategy);
passport.use(githubStrategy);
passport.use(facebookStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);

  done(null, user);
});

export default passport;

// BEST PRACTICES BELOW IN COMMONJS:
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/github/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Primary email fallback logic
//         const email =
//           profile.emails && profile.emails[0] ? profile.emails[0].value : null;
//         const avatarUrl =
//           profile.photos && profile.photos[0] ? profile.photos[0].value : null;

//         // Production practice: Upsert profile changes dynamically
//         const [user] = await User.findOrCreate({
//           where: { githubId: profile.id },
//           defaults: {
//             username: profile.username,
//             email: email,
//             avatarUrl: avatarUrl,
//           },
//         });
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     },
//   ),
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findByPk(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// module.exports = passport;
