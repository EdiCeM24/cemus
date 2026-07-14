import express from "express";

const router = express.Router();

// // GOOGLE
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     scope: ["profile", "email"],
//   }),

//   (req, res) => {
//     res.redirect("/home");
//   },
// );

// // FACEBOOK
// router.get(
//   "/facebook",

//   passport.authenticate("facebook", {
//     failureRedirect: "/login",
//     scope: ["email"],
//   }),

//   (req, res) => {
//     res.redirect("/home");
//   },
// );

// // GITHUB

// router.get(
//   "/github/callback",

//   passport.authenticate("github", {
//     failureRedirect: "/login",
//     scope: ["user:email"],
//   }),

//   (req, res) => {
//     res.redirect("/home");
//   },
// );

// Logout route
router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });
});
// BEST PRACTICE: Add a catch-all route for undefined endpoints
