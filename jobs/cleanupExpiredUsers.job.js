import cron from "node-cron";
import { Op } from "sequelize";

import User from "../models/User.model.js";

const cleanupExpiredUsers = () => {
  cron.schedule(
    "0 * * * *",

    async () => {
      await User.destroy({
        where: {
          isVerified: false,

          verificationTokenExpires: {
            [Op.lt]: new Date(),
          },
        },
      });

      console.log("Expired users cleaned");
    },
  );
};

export default cleanupExpiredUsers;
