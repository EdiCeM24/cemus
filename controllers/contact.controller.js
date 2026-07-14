import Contact from "../models/contact.model.js";
import {} from "../config/env.js";
import sendEmail from "../config/sendEmail.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Op } from "sequelize";

//
// app.use(csrf({ cookie: true }));

export const handleContactForm = async (req, res) => {
  res.render("contact", { title: "Contact Edidiong" }, (err, ejs) => {
    if (err) {
      return req.flash("error_msg", "Page not found or template error");
    } else {
      req.flash("success_msg", "Page loaded successfully!");
    }
    res.send(ejs);
  });
};

export const handleContactLogic = async (req, res) => {
  try {
    let { name, email, website, company, subject, message } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    website = website?.trim();
    company = company?.trim();
    subject = subject?.trim();
    message = message?.trim();

    if (!name || !email || !website || !company || !subject || !message) {
      return req.flash("error_msg", "All fields required!");
    }

    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Website: ", website);
    console.log("Company: ", company);
    console.log("Subject: ", subject);
    console.log("Message: ", message);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      req.flash("error_msg", "Invalid credentials!");
      return res.redirect("/api/v1/contacts/contact");
    }

    const websiteUrl =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

    if (!websiteUrl.test(website)) {
      req.flash("error_msg", "Invalid credentials!");
      return res.redirect("/api/v1/contacts/contact");
    }

    const user = Contact.findOne({
      where: {
        [Op.or]: [{ email }, { name }],
      },
    });

    if (!user) {
      req.flash("error_msg", "Contact not found!");

      return res.redirect("/api/v1/contacts/contact");
    }

    const contactUser = await Contact.create({
      name,
      email,
      website,
      company,
      subject,
      message,
    });

    await sendEmail({
      to: contactUser.email,
      subject: "Your Messages have been sent!",
      html: `
        <h2>Email Confirmation. Thank you!</h2>
      `,
    });

    req.flash("success_msg", "Message sent successfully ✅");

    return res.redirect("/api/v1/contacts/contact");
  } catch (error) {
    console.log(error);
    return req.flash("error_msg", "Error in submitting th contact form");
  }
};

export const deleteContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Contact.findByPk(id);

    if (!user) {
      req.flash("error_msg", "User not found!");
    }

    await user.destroy();

    req.flash("success_msg", "User deleted successfully ✅");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error deleting user");

    return res.redirect("/api");
  }
});
