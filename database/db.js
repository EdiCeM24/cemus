import { Sequelize } from "sequelize";
import {
  NODE_ENV,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} from "../config/env.js";

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  {
    dialect: "postgres",
    host: "localhost",
    port: DATABASE_PORT,
    logging:
      NODE_ENV === "production" ? false : console.log("development.local"),
  },
);

export default sequelize;
