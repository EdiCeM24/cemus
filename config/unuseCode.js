import User from "../models/User.model.js";
import crypto from 'crypto';

export const verifyAuth = async (req, res) => {
  try {
    const { email, code  } = req.body;
    if (!email || !code ) {
      return res.status(400).json({ message: 'All fields required!' });
    };

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found!'})
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid code!' });
    };

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Verified successfully!'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
}




if (!user) {
      return res.status(500).json({ message: 'User creation failed'});
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    user.verificationToken = hashedToken;
    user.verificationTokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour  



     const user = User.findByPk({id: useId.id });

    if (!user.isAuthenticated) {
      return res.status(400).json({ message: 'User is not Authenticated!'})
    }