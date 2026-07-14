import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const UserSchema = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    username: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      required: true,
      trim: true,
      allowNull: false,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      allowNull: false,
    },
    profile: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
    },
    verificationToken: {
      type: DataTypes.STRING,
    },
    accessToken: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
    },
    resendCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    resendBlockedUntil: {
      type: DataTypes.DATE,
    },
    oauthProvider: {
      type: DataTypes.ENUM("local", "google", "github", "facebook"),
      defaultValue: "local",
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.TEXT,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "super_admin"),
      defaultValue: "user",
    },
    isAdmin: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.role === "admin";
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: true },
);

const User = UserSchema;

export default User;
