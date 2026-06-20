import User from "../models/User.model.js";

const verifyUser = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (!user.isVerified) {
      return res.render("login", {
        error: "Please verify your email first",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    req.flash("success", "Email verified successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default verifyUser;
