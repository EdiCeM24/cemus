import asyncHandler from "../utils/asyncHandler.js";

export const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

const homePage = asyncWrapper(async (req, res) => {
  try {
    res.render("home", { title: "Edidiong Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    });
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export const about = asyncWrapper(async (req, res) => {
  try {
    res.render("about", { title: "About Me's Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    });
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});
export const project = asyncWrapper(async (req, res) => {
  try {
    res.render("projects", { title: "Project's Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    });
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export const handleSignup = asyncWrapper(async (req, res) => {
  try {
    res.render("auth/index", { title: "Registration Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }
      res.send(ejs);
    });
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export const handleLogin = asyncHandler(async (req, res) => {
  try {
    res.render("auth/login", { title: "Login Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully! ✅");
      }

      res.send(ejs);
    });
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export const verifyTokenMessage = asyncHandler(async (req, res) => {
  try {
    res.render("verify-email", { title: "Edidiong's Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    });
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return res.redirect("/api/v1/auth/sign-up");
  }
});

export const verifySuccessMessage = asyncHandler(async (req, res) => {
  try {
    res.render("verify-success", { title: "Edidiong's Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }

      res.send(ejs);
    });
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export const termsOfUse = asyncHandler(async (req, res) => {
  try {
    res.render(
      "private/terms-of-use",
      { title: "Edidiong's Page" },
      (err, ejs) => {
        if (err) {
          return req.flash("error_msg", "Page not found or template error");
        } else {
          req.flash("success_msg", "Page loaded successfully!");
        }

        res.send(ejs);
      },
    );
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export const privacyPolicy = asyncHandler(async (req, res) => {
  try {
    res.render(
      "private/privacy-policy",
      { title: "Edidiong's Page" },
      (err, ejs) => {
        if (err) {
          return req.flash("error_msg", "Page not found or template error");
        } else {
          req.flash("success_msg", "Page loaded successfully!");
        }

        res.send(ejs);
      },
    );
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export default homePage;
