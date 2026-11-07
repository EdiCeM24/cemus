import { Op } from "sequelize";
import sequelize from "../database/db.js";
import Message from "../models/AboutModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const messageForm = asyncHandler(async (req, res) => {
  let {
    name,
    email,
    phoneNumber,
    company,
    website,
    subject,
    service,
    budget,
    message,
  } = req.body;

  let budgetType;

  name = name?.trim();
  email = email?.trim().toLowerCase();
  phoneNumber = phoneNumber?.trim();
  company = company?.trim();
  website = website?.trim();
  subject = subject?.trim();
  message = message?.trim();

  if (
    !name ||
    !email ||
    !phoneNumber ||
    !company ||
    !website ||
    !subject ||
    !service ||
    !budget ||
    !message
  ) {
    req.flash("error_msg", "All fields required!");
    return res.redirect("/api/v1/homes/about");
  }

  const transaction = await sequelize.transaction();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    req.flash("error_msg", "Invalid email address!");
    return res.redirect("/api/v1/homes/about");
  }

  const websiteUrl =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

  if (!websiteUrl.test(website)) {
    req.flash("error_msg", "Invalid website address!");
    return res.redirect("/api/v1/homes/about");
  }

  const userMessage = await Message.findOne({
    where: {
      [Op.or]: [{ email: email }, { website: website }],
    },
    transaction,
  });

  if (userMessage) {
    req.flash("error_msg", "Message already exists!");
    return res.redirect("/api/v1/homes/about");
  }

  switch (budget) {
    case "1":
      budgetType = "1000";
      break;
    case "2":
      budgetType = "1500";
      break;
    case "3":
      budgetType = "2000";
      break;
    case "4":
      budgetType = "2500";
      break;
    case "5":
      budgetType = "3000";
      break;
    case "6":
      budgetType = "3500+";
      break;
    default:
      budgetType = "unrecognized";
  }

  const newMessage = await Message.create(
    {
      name,
      email,
      phoneNumber,
      company,
      website,
      subject,
      service,
      budget: budgetType,
      message,
    },
    transaction,
  );

  if (!newMessage) {
    await transaction.rollback();
    req.flash("error_msg", "Message not created successfully!");
    return res.redirect("/api/v1/homes/about");
  } else {
    await transaction.commit();
    req.flash("success_msg", "Message was submitted successfully!");
    return res.redirect("/api/v1/homes/home");
  }
});

export default messageForm;
