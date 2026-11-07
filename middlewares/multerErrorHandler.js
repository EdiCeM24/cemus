import multer from "multer";

const fileSizeErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    req.flash("error", "File size exceeds the limit of 3MB.");
    return res.redirect("/api/v1/auth/sign-up");
  }

  next(err);
};

export default fileSizeErrorHandler;
