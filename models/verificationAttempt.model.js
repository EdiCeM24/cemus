import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const VerificationAttempt = sequelize.define("VerificationAttempt", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  blockedUntil: {
    type: DataTypes.DATE,
  },
});

export default VerificationAttempt;
