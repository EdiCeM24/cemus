import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../database/db.js";

const productImageSchema = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: true },
);

const ProductImage = productImageSchema;

export default ProductImage;
