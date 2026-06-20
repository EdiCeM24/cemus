import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const ContactSchema = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      trim: true,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "super_admin"),
      defaultValue: "user",
    },
  },
  { timestamps: true },
);

const Contact = ContactSchema;

export default Contact;
