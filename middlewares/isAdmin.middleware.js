import User from "../models/User.model.js";

const isAdmin = async (req, res, next) => {
  const { id } = req.params.id;

  const user = await User.findByPk(id);

  if (!user) {
    req.flash("error_msg", "User not found!");

    return res.redirect("/api/v1/auth/login");
  }

  if (req.user.role !== "admin") {
    req.flash("error_msg", "Access denied. Admin only!");
    await user.destroy();
    return res.redirect("/api/v1/auth/sign-up");
  }
  next();
};

export default isAdmin;
