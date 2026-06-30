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
    res.render("home", { title: "Edidiong's Page" }, (err, ejs) => {
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
    res.render(
      "index",
      { title: "Register's Page", csrfToken: req.csrfToken() },
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

export const handleLogin = asyncHandler(async (req, res) => {
  try {
    res.render(
      "login",
      { title: "Login's Page", csrfToken: req.csrfToken() },
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
    return;
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

export default homePage;
