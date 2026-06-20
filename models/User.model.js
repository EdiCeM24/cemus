import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const UserSchema = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      required: true,
    },
    lastName: {
      type: DataTypes.STRING,
      required: true,
    },
    username: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
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
      ty
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
  },
  { timestamps: true },
);

const User = UserSchema;

export default User;
