import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const LoginDevice = sequelize.define("LoginDevice", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  deviceId: {
    type: DataTypes.STRING,
  },

  browser: {
    type: DataTypes.STRING,
  },

  os: {
    type: DataTypes.STRING,
  },

  ipAddress: {
    type: DataTypes.STRING,
  },

  refreshToken: {
    type: DataTypes.TEXT,
  },
});

export default LoginDevice;
