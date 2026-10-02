"use strict";

import { Sequelize } from "sequelize";
import config from "../database/config.js";

import User from "./User.model.js";
import OAuthAccount from "./OauthAccount.model.js";

import User from "./User.model.js";
import Contact from "./contact.model.js";
import LoginDevice from "./loginDevice.model.js";

// =========================
// USER ↔ CONTACT
// =========================
User.hasOne(Contact, {
  foreignKey: "userId",
  as: "Contact",
});
Contact.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});
// =========================
// USER ↔ OAUTHACCOUNT
// =========================
User.hasMany(OAuthAccount);
OAuthAccount.belongsTo(User);

// =========================
// USER ↔ OAUTHACCOUNT
// =========================
User.hasOne(LoginDevice, { foreignKey: "userId" });
LoginDevice.belongsTo(User, { foreignKey: "userId" });

//
const sequelize = new Sequelize(config.production);

export default sequelize;
