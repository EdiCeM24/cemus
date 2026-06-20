import { asyncWrapper } from "./home.controller.js";

const codeVerified = asyncWrapper(async (req, res) => {
  res.render("verify-code", { title: "Edidiong's Page" }, (err, ejs) => {
    if (err) {
      return req.flash("error_msg", "Page not found or template error");
    } else {
      req.flash("success_msg", "Page loaded successfully!");
    }

    res.send(ejs);
  });
});

export default codeVerified;
