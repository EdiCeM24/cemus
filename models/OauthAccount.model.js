import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../database/db.js";

const OAuthAccount = sequelize.define("OAuthAccount", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  provider: {
    type: DataTypes.ENUM("google", "facebook", "github"),
    allowNull: false,
  },

  providerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  accessToken: {
    type: DataTypes.TEXT,
  },

  refreshToken: {
    type: DataTypes.TEXT,
  },
});

export default OAuthAccount;
