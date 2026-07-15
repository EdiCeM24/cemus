import cron from "node-cron";
import { Op } from "sequelize";

import User from "../models/User.model.js";

const cleanupExpiredUsers = () => {
  const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
  cron.schedule(
    "0 * * * *",

    async () => {
      await User.destroy({
        where: {
          isVerified: false,

          verificationTokenExpires: {
            [Op.lt]: new Date(),
          },
          createdAt: {
            [Op.lt]: expirationTime,
          },
        },
      });

      console.log("Expired users cleaned");
    },
  );
};

export default cleanupExpiredUsers;
