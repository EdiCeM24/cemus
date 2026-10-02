import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
// import sequelize from "./index.js";

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
      fields: "userid",
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
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userid", "deviceId"],
      },
      {
        fields: ["ipAddress"],
      },
      {
        name: "custom_index_name",
        fields: ["browser", "os"],
      },
    ],
  },
);

export default LoginDevice;
