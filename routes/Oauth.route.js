import express from "express";

const router = express.Router();

// router.post("/refresh-token", refreshToken);

// router.post("/verify-code", verifyCode);

// router.post("/resend-verification", resendVerificationEmail);

// GOOGLE
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    res.redirect("/home");
  },
);

// FACEBOOK
router.get(
  "/facebook",

  passport.authenticate("facebook", {
    scope: ["email"],
  }),
);

router.get(
  "/facebook/callback",

  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    res.redirect("/home");
  },
);

// GITHUB
router.get(
  "/github",

  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);

router.get(
  "/github/callback",

  passport.authenticate("github", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    res.redirect("/home");
  },
);

// BEST PRACTICE: Add a catch-all route for undefined endpoints

// routes/auth.routes.js

import passport from "passport";

import { Router } from "express";

router.get(
  "/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    res.redirect("/dashboard");
  },
);

// GITHUB
router.get(
  "/github",

  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);

router.get(
  "/github/callback",

  passport.authenticate("github", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    res.redirect("/dashboard");
  },
);

// FACEBOOK
router.get(
  "/facebook",

  passport.authenticate("facebook", {
    scope: ["email"],
  }),
);

router.get(
  "/facebook/callback",

  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    res.redirect("/dashboard");
  },
);

// Logout route
router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });
});

// const router = Router();
