import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const LoginDevice = sequelize.define(
  "LoginDevice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id",
      },
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
    indexes: [
      {
        unique: true,
        fields: ["userId", "deviceId"],
      },
    ],
  },
  { timestamps: true },
);

export default LoginDevice;
