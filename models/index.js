"use strict";

import User from "./User.model.js";
import OAuthAccount from "./OauthAccount.model.js";

import User from "./User.model.js";
import Contact from "./contact.model.js";

// =========================
// USER ↔ CONTACT
// =========================
User.hasOne(Contact, {
  foreignKey: "userId",
  as: "contact",
});
Contact.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
// =========================
// USER ↔ OAUTHACCOUNT
// =========================
User.hasMany(OAuthAccount);
OAuthAccount.belongsTo(User);
