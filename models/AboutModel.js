import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../database/db.js";
// import sequelize from "./index.js";

const aboutForm = sequelize.define(
  "About",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service: {
      type: DataTypes.ENUM("freelance", "remote", "onSite"),
      allowNull: false,
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "negotiated"),
      defaultValue: "pending",
    },
  },
  { timestamps: true },
);

const Message = aboutForm;

export default Message;
