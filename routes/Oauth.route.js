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
