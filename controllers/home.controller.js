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
    res.render("index");

    // res.render("home", { title: "Edidiong's Page" }, (err, ejs) => {
    //   if (err) {
    //     return req.flash("error_msg", "Page not found or template error");
    //   } else {
    //     req.flash("success_msg", "Page loaded successfully!");
    //   }

    //   res.send(ejs);
    // });
    // console.log("Find the failed load page: ", err);
  } catch (error) {
    console.log("why the failed page: ", error);

    req.flash("error_msg", "We are sorry that your page unable to load: ", err);
    return;
  }
});

export const about = asyncWrapper(async (req, res) => {
  res.render("about", { title: "Edidiong's Page" }, (err, ejs) => {
    if (err) {
      req.flash("error_msg", "Page not found or template error");
    } else {
      req.flash("success_msg", "Page loaded successfully!");
    }

    res.send(ejs);
  });
});
export const project = asyncWrapper(async (req, res) => {
  res.render("projects", { title: "Edidiong's Page" }, (err, ejs) => {
    if (err) {
      req.flash("error_msg", "Page not found or template error");
    } else {
      req.flash("success_msg", "Page loaded successfully!");
    }

    res.send(ejs);
  });
});

export const handleSignup = asyncWrapper(async (req, res) => {
  res.render("index", { title: "Register Page" }, (err, ejs) => {
    if (err) {
      req.flash("error_msg", "Page not found or template error");
    } else {
      req.flash("success_msg", "Page loaded successfully!");
    }
    res.send(ejs);
  });
});

export const handleLogin = asyncHandler(async (req, res) => {
  res.render("login", { title: "Login Page" }, (err, ejs) => {
    if (err) {
      req.flash("error_msg", "Page not found or template error");
    } else {
      req.flash("success_msg", "Page loaded successfully!");
    }
    res.send(ejs);
  });
});

export const verifyTokenMessage = asyncHandler(async (req, res) => {
  res.render("verify-email", { title: "Register Page" }, (err, ejs) => {
    if (err) {
      req.flash("error_msg", "Page not found or template error");
    } else {
      req.flash("success_msg", "Page loaded successfully!");
    }
    res.send(ejs);
  });
});

export default homePage;
