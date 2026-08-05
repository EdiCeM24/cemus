import Contact from "../models/contact.model.js";
import {} from "../config/env.js";
import sendEmail from "../config/sendEmail.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Op } from "sequelize";
import sequelize from "../database/db.js";

//
// app.use(csrf({ cookie: true }));

export const handleContactForm = async (req, res) => {
  try {
    res.render("contact", { title: "Contact Edidiong" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Page loaded successfully!");
      }
      res.send(ejs);
    });
  } catch (error) {
    req.flash("error_msg", "Page not found or template error ", error);
  }
};

export const handleContactLogic = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { name, email, website, company, activity, subject, message } =
      req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    website = website?.trim();
    company = company?.trim();
    activity = activity?.trim();
    subject = subject?.trim();
    message = message?.trim();

    if (
      !name ||
      !email ||
      !website ||
      !company ||
      !activity ||
      !subject ||
      !message
    ) {
      req.flash("error_msg", "All fields required!");
      return res.redirect("/api/v1/contacts/contact");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      req.flash("error_msg", "Invalid email!");
      return res.redirect("/api/v1/contacts/contact");
    }

    const websiteUrl =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

    if (!websiteUrl.test(website)) {
      req.flash("error_msg", "Invalid website!");
      return res.redirect("/api/v1/contacts/contact");
    }

    const user = await Contact.findOne({
      where: {
        [Op.or]: [{ email }, { name }],
      },
      transaction,
    });

    if (user) {
      req.flash("error_msg", "Contact already exists!");
      return res.redirect("/api/v1/contacts/contact");
    }

    const contactUser = await Contact.create(
      {
        name,
        email,
        website,
        company,
        activity,
        subject,
        message,
      },
      { transaction },
    );

    await sendEmail({
      to: contactUser.email,
      subject: "Your Messages have been sent!",
      html: `
      <h2>Email Confirmation. Thank you!</h2>
      `,
    });

    await transaction.commit();

    req.flash("success_msg", "Message sent successfully ✅");

    return res.redirect("/api/v1/contacts/contact");
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return req.flash("error_msg", "Error occured.");
  }
};

export const deleteContact = asyncHandler(async (req, res) => {
  const transaction = sequelize.transaction();
  try {
    const { id } = req.params.id;

    const user = await Contact.findByPk(id);

    if (!user) {
      req.flash("error_msg", "User not found!");
      await transaction.rollback();
    }

    await user.destroy();

    req.flash("success_msg", "User deleted successfully ✅");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error deleting user");
    await transaction.rollback();
    return res.redirect("/api");
  }
});
