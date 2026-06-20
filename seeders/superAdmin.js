import bcryptSalt from "bcryptjs";
import sequelize from "../database/db.js";
import User from "../models/User.model.js";
import { Op } from "sequelize";

(async () => {
  await sequelize.sync();

  const salt = await bcryptSalt.genSalt(12);

  const admin = await User.findOne({
    where: {
      [Op.or]: [{ role: "super_admin" }, { role: "admin" }],
    },
  });

  if (!admin) {
    const hashedPassword = await bcryptSalt.hash(password, salt);

    await User.create({
      usename,
      email,
      password: hashedPassword,
      role: admin,
    });

    req.flesh("success_msg", "Super user created successfully!");
  }

  process.exit();
})();
